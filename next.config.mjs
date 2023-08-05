/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },

  images: {
    domains: ['lh3.googleusercontent.com', 'cdn.intra.42.fr'],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    NUXT_PUBLIC_API_URL: process.env.SERVER_API_URL,
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    NUXT_PUBLIC_API_URL: process.env.PUBLIC_API_URL,
  },
};

export default config;
