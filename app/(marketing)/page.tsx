import {
  HeroSearch,
  StatsBar,
  FeaturedListingsGrid,
  FeaturedRegionsMasonry,
  UtilityTools,
  PromoBanner,
  BlogStrip,
  FeatureDescriptions,
} from '@/components/home';
import { Reveal } from '@/components/ui';
import { RecentlyViewed } from '@/components/listing';
import { listListings, listBlogs } from '@/lib/server-data';

export default async function HomePage() {
  const [vipResult, newestResult, blogResult] = await Promise.all([
    listListings({ vipOnly: true, sort: 'newest', pageSize: 6 }),
    listListings({ sort: 'newest', pageSize: 6 }),
    listBlogs({ pageSize: 10 }),
  ]);

  return (
    <>
      <HeroSearch />
      <Reveal direction="fade">
        <StatsBar />
      </Reveal>
      <Reveal>
        <FeaturedListingsGrid
          title="Tin VIP nổi bật"
          description="Những tin đăng được lựa chọn và đẩy top bởi chủ đăng"
          listings={vipResult.data}
          href="/tin-dang?vipOnly=true"
        />
      </Reveal>
      <Reveal direction="scale">
        <FeaturedRegionsMasonry />
      </Reveal>
      <Reveal direction="up">
        <PromoBanner />
      </Reveal>
      <Reveal>
        <FeaturedListingsGrid
          title="Tin đăng mới nhất"
          description="Cập nhật liên tục theo thời gian thực"
          listings={newestResult.data}
          href="/tin-dang"
        />
      </Reveal>
      <Reveal direction="up">
        <UtilityTools />
      </Reveal>
      <Reveal direction="up">
        <RecentlyViewed />
      </Reveal>
      <Reveal>
        <BlogStrip blogs={blogResult.data} />
      </Reveal>
      <Reveal direction="fade">
        <FeatureDescriptions />
      </Reveal>
    </>
  );
}
