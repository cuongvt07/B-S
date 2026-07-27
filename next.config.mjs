/** @type {import('next').NextConfig} */
function resolveRealApi() {
  const configured = process.env.NEXT_PUBLIC_REAL_API_URL || '';
  try {
    const host = new URL(configured).host;
    if (host.endsWith('vercel.app')) return 'https://vmphuthinhland.com';
  } catch {
    // ignore invalid or empty env
  }
  return configured || 'https://vmphuthinhland.com';
}

const REAL_API = resolveRealApi();

const nextConfig = {
  reactStrictMode: true,
  images: {
    // Phục vụ AVIF/WebP cho mọi ảnh qua next/image (nhẹ hơn JPEG 40-70%).
    formats: ['image/avif', 'image/webp'],
    // Ảnh đã tối ưu được cache tối thiểu 30 ngày ở CDN/edge.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      // Real API (MediaBDS) hosts
      { protocol: 'https', hostname: 'vmphuthinhland.com' },
      { protocol: 'https', hostname: '*.vmphuthinhland.com' },
      // Long Vân S3 — ảnh cũ vẫn nằm ở đây
      { protocol: 'https', hostname: 's3-hcm5-r1.longvan.net' },
      { protocol: 'https', hostname: '*.longvan.net' },
      // AZ Cloud (FPT) S3 — nơi ảnh tin đăng MỚI được lưu (bucket vm24h)
      { protocol: 'https', hostname: 'vn-fpt.azcloudstorage.com' },
      { protocol: 'https', hostname: '*.azcloudstorage.com' },
    ],
  },
  // Proxy Laravel API endpoints so browser sees them as same-origin.
  // Cookie-based Sanctum auth then works without cross-domain CORS gymnastics.
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${REAL_API}/api/v1/:path*`,
      },
      {
        source: '/sanctum/:path*',
        destination: `${REAL_API}/sanctum/:path*`,
      },
    ];
  },
};

export default nextConfig;
