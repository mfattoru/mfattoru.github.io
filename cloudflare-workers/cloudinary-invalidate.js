/**
 * Cloudflare Worker — Cloudinary Cache Invalidation
 *
 * Deploy:
 *   cd cloudflare-workers && npx wrangler deploy
 *
 * Add secrets (run once each, wrangler will prompt for the value):
 *   npx wrangler secret put CLOUDINARY_CLOUD_NAME
 *   npx wrangler secret put CLOUDINARY_API_KEY
 *   npx wrangler secret put CLOUDINARY_API_SECRET   ← from cloudinary.com → Settings → API Keys
 */

async function sha1hex(message) {
  const data = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function invalidateOne(cloudName, apiKey, apiSecret, publicId) {
  const timestamp = Math.floor(Date.now() / 1000);

  // Cloudinary signature: sort params alphabetically, join as key=value&..., append secret
  const params = { invalidate: 'true', public_id: publicId, timestamp, type: 'upload' };
  const signStr = Object.keys(params).sort()
    .map(k => `${k}=${params[k]}`)
    .join('&') + apiSecret;
  const signature = await sha1hex(signStr);

  const form = new FormData();
  form.append('api_key', apiKey);
  form.append('signature', signature);
  form.append('timestamp', String(timestamp));
  form.append('public_id', publicId);
  form.append('type', 'upload');
  form.append('invalidate', 'true');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/explicit`,
    { method: 'POST', body: form }
  );

  const json = await res.json();
  return { public_id: publicId, status: res.ok ? 'ok' : 'error', ...json };
}

export default {
  async fetch(request, env) {
    const allowedOrigins = (env.ALLOWED_ORIGINS ?? '').split(',').map(s => s.trim()).filter(Boolean);
    const origin = request.headers.get('Origin') ?? '';
    const corsOrigin = allowedOrigins.includes(origin) ? origin : (allowedOrigins[0] ?? '');
    const corsHeaders = {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { public_ids } = body;
    if (!Array.isArray(public_ids) || public_ids.length === 0) {
      return new Response(JSON.stringify({ error: 'public_ids must be a non-empty array' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = await Promise.all(
      public_ids.map(id =>
        invalidateOne(env.CLOUDINARY_CLOUD_NAME, env.CLOUDINARY_API_KEY, env.CLOUDINARY_API_SECRET, id)
      )
    );

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  },
};

// ALLOWED_ORIGINS is set as a secret via wrangler secret put ALLOWED_ORIGINS
// Comma-separated list of allowed origins, e.g: https://clientdomain.com,http://localhost:4321
