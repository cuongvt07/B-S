/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      // Real API (MediaBDS) hosts
      { protocol: 'https', hostname: 'vmphuthinhland.com' },
      { protocol: 'https', hostname: '*.vmphuthinhland.com' },
      // Long Vân S3 — where actual listing photos live
      { protocol: 'https', hostname: 's3-hcm5-r1.longvan.net' },
      { protocol: 'https', hostname: '*.longvan.net' },
    ],
  },
};

export default nextConfig;
