import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withPWA({
  dest: 'public', // PWA configuration to store the service worker
  disable: process.env.NODE_ENV === 'development', // Disable during development
  register: true, // Auto-register the service worker
  skipWaiting: true, // Activate new service workers immediately
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico|css|js)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^\/$/i, // Cache the index page (home page)
      handler: 'NetworkFirst',
      options: {
        cacheName: 'index-cache',
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
      },
    },
  ],
})(nextConfig);
