// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import placeholderReport from './integrations/placeholder-report.mjs';

// The live domain; Netlify can override it with the SITE_URL environment variable.
const SITE_URL = process.env.SITE_URL ?? 'https://matincc.ca';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  // No code blocks on this site; Shiki's inline styles would also clash with the CSP.
  markdown: { syntaxHighlight: false },

  // Public settings read at build time (see .env.example). All optional:
  // the site works with none of them set.
  env: {
    schema: {
      PUBLIC_ANALYTICS_PROVIDER: envField.enum({
        context: 'client',
        access: 'public',
        values: ['none', 'plausible', 'ga4'],
        default: 'none',
      }),
      PUBLIC_PLAUSIBLE_DOMAIN: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      PUBLIC_GA_ID: envField.string({ context: 'client', access: 'public', optional: true }),
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      // netlify = forms stored in Netlify Forms (notifications set up in the Netlify UI);
      // email = forms sent to /api/submit, which emails the administrative inbox.
      PUBLIC_FORMS_MODE: envField.enum({
        context: 'client',
        access: 'public',
        values: ['netlify', 'email'],
        default: 'netlify',
      }),
      PUBLIC_NEWSLETTER_MODE: envField.enum({
        context: 'client',
        access: 'public',
        values: ['netlify', 'brevo'],
        default: 'netlify',
      }),
    },
  },

  // Content Security Policy: Astro hashes its own inline scripts, so only those
  // and the few third parties listed here (loaded after consent or a click) can run.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
        "font-src 'self' data:",
        "connect-src 'self' https://plausible.io https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://challenges.cloudflare.com",
        'frame-src https://www.youtube-nocookie.com https://www.google.com https://challenges.cloudflare.com',
        "form-action 'self'",
        "base-uri 'self'",
        "object-src 'none'",
      ],
      scriptDirective: {
        resources: [
          "'self'",
          // Pagefind (site search) runs a small WebAssembly module.
          "'wasm-unsafe-eval'",
          'https://plausible.io',
          'https://www.googletagmanager.com',
          'https://challenges.cloudflare.com',
        ],
      },
      // Inline style attributes (wave colours, animation delays) are harmless;
      // allowing them keeps the markup simple.
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },

  integrations: [placeholderReport()],
  vite: {
    plugins: [tailwindcss()],
  },
});
