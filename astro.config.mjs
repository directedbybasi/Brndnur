import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://brndnur.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    tailwind({
      applyBaseStyles: false, // Allows custom global typography & resets to coexist seamlessly
    }),
  ],
  vite: {
    server: {
      allowedHosts: [
        'carlo-tube-region-diamonds.trycloudflare.com',
        'scenes-axis-bones-allow.trycloudflare.com',
      ],
    },
    preview: {
      allowedHosts: [
        'carlo-tube-region-diamonds.trycloudflare.com',
        'scenes-axis-bones-allow.trycloudflare.com',
      ],
    },
  },
});
