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
import { REGION_DEFAULTS, type RegionStat } from '@/components/home/FeaturedRegionsMasonry';
import { Reveal } from '@/components/ui';
import { RecentlyViewed } from '@/components/listing';
import { listListings, listBlogs } from '@/lib/server-data';

async function fetchProvinceCount(provinceName: string): Promise<number> {
  try {
    const res = await listListings({
      pageSize: 1,
      // We don't have a clean way to pass `province` directly without a cityCode mapping —
      // approximate by abusing cityCode lookup. Skip mapping and trust API meta.total.
      // For now, just call list with no filter and return whole total (handled at call site).
    });
    // Reusing whole-total isn't accurate per region; instead make a direct fetch.
    void res;
  } catch {
    // ignore
  }

  const REAL = process.env.NEXT_PUBLIC_REAL_API_URL ?? 'https://vmphuthinhland.com';
  try {
    const r = await fetch(
      `${REAL}/api/v1/listings?per_page=1&province=${encodeURIComponent(provinceName)}`,
      { headers: { Accept: 'application/json' }, next: { revalidate: 120 } }
    );
    if (!r.ok) return 0;
    const data = (await r.json()) as { meta?: { total?: number } };
    return data.meta?.total ?? 0;
  } catch {
    return 0;
  }
}

export default async function HomePage() {
  const [vipResult, newestResult, landResult, blogResult, regionCounts] = await Promise.all([
    // "Tin đăng nổi bật" → 10 tin mới nhất
    listListings({ sort: 'newest', pageSize: 10 }),
    // "Tin đăng mới nhất" → trang 2 để không trùng
    listListings({ sort: 'newest', pageSize: 10, page: 2 }),
    // Đất nền — section bổ sung
    listListings({ propertyType: 'land', pageSize: 8, sort: 'newest' }),
    listBlogs({ pageSize: 10 }),
    Promise.all(REGION_DEFAULTS.map((r) => fetchProvinceCount(r.provinceName))),
  ]);

  const regions: RegionStat[] = REGION_DEFAULTS.map((r, i) => ({
    ...r,
    count: regionCounts[i],
  }));

  return (
    <>
      <HeroSearch />
      <Reveal direction="fade">
        <StatsBar />
      </Reveal>
      <Reveal>
        <FeaturedListingsGrid
          title="Tin đăng nổi bật"
          description={`${vipResult.meta.total.toLocaleString('vi-VN')} tin đăng đang hiển thị — cập nhật mới nhất`}
          listings={vipResult.data}
          href="/tin-dang"
        />
      </Reveal>
      <Reveal direction="scale">
        <FeaturedRegionsMasonry regions={regions} />
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
      {landResult.data.length > 0 && (
        <Reveal>
          <FeaturedListingsGrid
            title="Bán đất nền hot"
            description={`${landResult.meta.total.toLocaleString('vi-VN')} tin đất nền đang rao bán`}
            listings={landResult.data}
            href="/tin-dang?propertyType=land"
          />
        </Reveal>
      )}
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
