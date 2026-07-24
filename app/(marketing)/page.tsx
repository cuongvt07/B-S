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
import { getHomeBlogs, listListings, listVehicles } from '@/lib/server-data';

export const revalidate = 300;

export default async function HomePage() {
  const [featured, vehicles, blogResult] = await Promise.all([
    // Backend sorts by VIP tier (vip3→2→1→normal), newest within a tier.
    listListings({ sort: 'vip', pageSize: 8 }),
    listVehicles({ pageSize: 8, sortBy: 'vip', sortOrder: 'desc' }),
    getHomeBlogs(4),
  ]);

  const featuredListings = featured.data;

  return (
    <>
      <HeroSearch />
      <CategoryTiles />

      <Reveal direction="fade">
        <WhyAndPost />
      </Reveal>

      <Reveal>
        <FeaturedListingsGrid
          title="Bất Động Sản Nổi Bật"
          description={`${featured.meta.total.toLocaleString('vi-VN')} tin đăng đang hiển thị`}
          listings={featuredListings}
          href="/tin-dang"
          priorityCount={4}
        />
      </Reveal>

      <Reveal>
        <FeaturedVehiclesGrid
          title="Xe Cộ Nổi Bật"
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
        <BlogStrip data={blogResult} />
      </Reveal>
    </>
  );
}
