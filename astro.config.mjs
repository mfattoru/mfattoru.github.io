import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath, URL } from 'node:url';
import { readFileSync } from 'node:fs';

function getSiteLanguage() {
  try {
    const raw = readFileSync('src/content/site-settings/general.md', 'utf-8');
    const match = raw.match(/siteLanguage:\s*(\w+)/);
    const val = match?.[1];
    if (val === 'it' || val === 'en' || val === 'both') return val;
  } catch {}
  return 'both';
}

const siteLanguage = getSiteLanguage();

export default defineConfig({
  site: 'https://mfattoru.github.io',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      filter: (page) => {
        if (page.includes('/admin/')) return false;
        if (siteLanguage === 'it') return page.includes('/it/');
        if (siteLanguage === 'en') return page.includes('/en/');
        return true;
      },
      i18n: {
        defaultLocale: 'it',
        locales: { it: 'it-IT', en: 'en-US' },
      },
    }),
  ],
  output: 'static',
  image: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
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
  },
});
