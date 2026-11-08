// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project site: https://nachorob.github.io/portfolio/
// When a custom domain is configured, update `site` and set `base` to '/'.
export default defineConfig({
  site: 'https://nachorob.github.io',
  base: '/portfolio',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'always',
  },
});
