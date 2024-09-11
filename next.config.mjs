import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // This stays outside the PWA config
};

export default withPWA({
  dest: 'public', // PWA specific configuration
})(nextConfig);