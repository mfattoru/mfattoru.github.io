import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  site: 'https://mfattoru.github.io',
  integrations: [tailwind({ applyBaseStyles: false })],
  output: 'static',
  i18n: {
    defaultLocale: 'it',
    locales: ['it', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  redirects: {
    '/': '/it/',
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      {
        // Serve /admin directly in dev, bypassing Astro's i18n middleware
        name: 'admin-dev-passthrough',
        configureServer(server) {
          server.middlewares.use('/admin', (_req, res) => {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.end(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin — Ing. Fattoruso</title>
  <script>window.CMS_MANUAL_INIT = true;</script>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</head>
<body>
  <script>CMS.init({ config: { local_backend: true } });</script>
</body>
</html>`);
          });
        },
      },
    ],
  },
});
