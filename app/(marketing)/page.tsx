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
import {
  getHomepageSections,
  listBlogs,
  listListings,
  type HomepageSection,
} from '@/lib/server-data';

export const revalidate = 300;

async function fetchProvinceCount(provinceName: string): Promise<number> {
  const real = process.env.NEXT_PUBLIC_REAL_API_URL || 'https://vmphuthinhland.com';
  const host = real.includes('vercel.app') ? 'https://vmphuthinhland.com' : real;

  try {
    const r = await fetch(
      `${host}/api/v1/listings?per_page=1&province=${encodeURIComponent(provinceName)}`,
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
  const [homeSections, vipResult, newestResult, landResult, blogResult, regionCounts] =
    await Promise.all([
      getHomepageSections(),
      listListings({ sort: 'newest', pageSize: 8 }),
      listListings({ sort: 'newest', pageSize: 8, page: 2 }),
      listListings({ propertyType: 'land', pageSize: 8, sort: 'newest' }),
      listBlogs({ pageSize: 10 }),
      Promise.all(REGION_DEFAULTS.map((r) => fetchProvinceCount(r.provinceName))),
    ]);

  const regions: RegionStat[] = REGION_DEFAULTS.map((r, i) => ({
    ...r,
    count: regionCounts[i],
  }));
  const sections = homeSections.length > 0
    ? homeSections
    : fallbackHomeSections(vipResult, newestResult, landResult);

  return (
    <>
      <HeroSearch />
      <Reveal direction="fade">
        <StatsBar />
      </Reveal>
      {sections.map((section, index) =>
        renderHomeSection(section, {
          regions,
          blogs: blogResult.data,
          priorityCount: index === 0 ? 4 : 0,
        })
      )}
    </>
  );
}

function renderHomeSection(
  section: HomepageSection,
  context: {
    regions: RegionStat[];
    blogs: Awaited<ReturnType<typeof listBlogs>>['data'];
    priorityCount: number;
  }
) {
  if (section.sectionType === 'listings') {
    return (
      <Reveal key={section.key}>
        <FeaturedListingsGrid
          title={section.title}
          description={
            section.description ||
            `${section.meta.total.toLocaleString('vi-VN')} tin dang phu hop voi cau hinh`
          }
          listings={section.listings}
          href={section.href || '/tin-dang'}
          priorityCount={context.priorityCount}
        />
      </Reveal>
    );
  }

  if (section.sectionType === 'regions') {
    return (
      <Reveal key={section.key} direction="scale">
        <FeaturedRegionsMasonry regions={context.regions} />
      </Reveal>
    );
  }

  if (section.sectionType === 'promo') {
    return (
      <Reveal key={section.key} direction="up">
        <PromoBanner />
      </Reveal>
    );
  }

  if (section.sectionType === 'tools') {
    return (
      <Reveal key={section.key} direction="up">
        <UtilityTools />
      </Reveal>
    );
  }

  if (section.sectionType === 'recently_viewed') {
    return (
      <Reveal key={section.key} direction="up">
        <RecentlyViewed />
      </Reveal>
    );
  }

  if (section.sectionType === 'blogs') {
    return (
      <Reveal key={section.key}>
        <BlogStrip blogs={context.blogs} />
      </Reveal>
    );
  }

  if (section.sectionType === 'feature_descriptions') {
    return (
      <Reveal key={section.key} direction="fade">
        <FeatureDescriptions />
      </Reveal>
    );
  }

  return null;
}

function fallbackHomeSections(
  vipResult: Awaited<ReturnType<typeof listListings>>,
  newestResult: Awaited<ReturnType<typeof listListings>>,
  landResult: Awaited<ReturnType<typeof listListings>>
): HomepageSection[] {
  const sections: HomepageSection[] = [
    {
      key: 'featured_latest',
      title: 'Tin dang noi bat',
      description: `${vipResult.meta.total.toLocaleString('vi-VN')} tin dang dang hien thi`,
      sectionType: 'listings',
      sourceType: 'latest',
      href: '/tin-dang',
      limit: 8,
      sortOrderIndex: 10,
      meta: { total: vipResult.meta.total },
      listings: vipResult.data,
    },
    {
      key: 'regions',
      title: 'Khu vuc noi bat',
      sectionType: 'regions',
      sourceType: 'regions',
      limit: 5,
      sortOrderIndex: 20,
      meta: { total: 0 },
      listings: [],
    },
    {
      key: 'promo',
      title: 'Banner',
      sectionType: 'promo',
      sourceType: 'static',
      limit: 0,
      sortOrderIndex: 30,
      meta: { total: 0 },
      listings: [],
    },
    {
      key: 'newest',
      title: 'Tin dang moi nhat',
      description: 'Cap nhat lien tuc theo thoi gian thuc',
      sectionType: 'listings',
      sourceType: 'latest',
      href: '/tin-dang',
      limit: 8,
      sortOrderIndex: 40,
      meta: { total: newestResult.meta.total },
      listings: newestResult.data,
    },
    {
      key: 'land_hot',
      title: 'Ban dat nen hot',
      description: `${landResult.meta.total.toLocaleString('vi-VN')} tin dat nen dang rao ban`,
      sectionType: 'listings',
      sourceType: 'property',
      href: '/tin-dang?propertyType=land',
      limit: 8,
      sortOrderIndex: 50,
      meta: { total: landResult.meta.total },
      listings: landResult.data,
    },
    {
      key: 'tools',
      title: 'Tien ich',
      sectionType: 'tools',
      sourceType: 'static',
      limit: 0,
      sortOrderIndex: 60,
      meta: { total: 0 },
      listings: [],
    },
    {
      key: 'recently_viewed',
      title: 'Da xem gan day',
      sectionType: 'recently_viewed',
      sourceType: 'client',
      limit: 0,
      sortOrderIndex: 70,
      meta: { total: 0 },
      listings: [],
    },
    {
      key: 'blogs',
      title: 'Blog',
      sectionType: 'blogs',
      sourceType: 'latest',
      limit: 10,
      sortOrderIndex: 80,
      meta: { total: 0 },
      listings: [],
    },
    {
      key: 'feature_descriptions',
      title: 'Mo ta dich vu',
      sectionType: 'feature_descriptions',
      sourceType: 'static',
      limit: 0,
      sortOrderIndex: 90,
      meta: { total: 0 },
      listings: [],
    },
  ];

  return sections.filter((section) => section.key !== 'land_hot' || landResult.data.length > 0);
}
