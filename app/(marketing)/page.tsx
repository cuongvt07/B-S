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

export default async function HomePage() {
  const [featured, vehicles, blogResult] = await Promise.all([
    listListings({ sort: 'newest', pageSize: 8 }),
    listVehicles({ pageSize: 8, sortBy: 'created_at', sortOrder: 'desc' }),
    listBlogs({ pageSize: 8 }),
  ]);

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
          listings={featured.data}
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
