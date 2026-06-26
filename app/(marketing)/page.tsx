import {
  HeroSearch,
  CategoryTiles,
  WhyAndPost,
  FeaturedListingsGrid,
  FeaturedVehiclesGrid,
  ValuationBanners,
  HomeStatsRow,
  BlogStrip,
} from '@/components/home';
import { Reveal } from '@/components/ui';
import { RecentlyViewed } from '@/components/listing';
import { listBlogs, listListings, listVehicles } from '@/lib/server-data';

export const revalidate = 300;

// Higher VIP tiers surface first in the featured grid.
const VIP_RANK: Record<string, number> = { vip3: 3, vip2: 2, vip1: 1, normal: 0 };

export default async function HomePage() {
  const [featured, vehicles, blogResult] = await Promise.all([
    // Pull a larger window of newest listings, then float VIP tiers to the top.
    listListings({ sort: 'newest', pageSize: 24 }),
    listVehicles({ pageSize: 8, sortBy: 'created_at', sortOrder: 'desc' }),
    listBlogs({ pageSize: 8 }),
  ]);

  // Stable sort: VIP 3 → 2 → 1 → normal, keeping newest order within a tier.
  const featuredListings = [...featured.data]
    .sort((a, b) => (VIP_RANK[b.vipTier] ?? 0) - (VIP_RANK[a.vipTier] ?? 0))
    .slice(0, 8);

  return (
    <>
      <HeroSearch />
      <CategoryTiles />

      <Reveal direction="fade">
        <WhyAndPost />
      </Reveal>

      <Reveal>
        <FeaturedListingsGrid
          title="Bất động sản nổi bật"
          description={`${featured.meta.total.toLocaleString('vi-VN')} tin đăng đang hiển thị`}
          listings={featuredListings}
          href="/tin-dang"
          priorityCount={4}
        />
      </Reveal>

      <Reveal>
        <FeaturedVehiclesGrid
          title="Xe cộ nổi bật"
          description="Ô tô & xe máy mới đăng — cập nhật liên tục"
          vehicles={vehicles.data}
          href="/xe"
        />
      </Reveal>

      <Reveal direction="up">
        <ValuationBanners />
      </Reveal>

      <Reveal direction="fade">
        <HomeStatsRow />
      </Reveal>

      <Reveal direction="up">
        <RecentlyViewed />
      </Reveal>

      <Reveal>
        <BlogStrip blogs={blogResult.data} />
      </Reveal>
    </>
  );
}
