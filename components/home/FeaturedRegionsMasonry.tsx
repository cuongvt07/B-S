import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

export interface RegionStat {
  cityCode: string;
  name: string;
  /** Province name to pass as query when navigating (matches API province field). */
  provinceName: string;
  img: string;
  className?: string;
  count: number;
}

const REGION_DEFAULTS: Omit<RegionStat, 'count'>[] = [
  {
    name: 'TP. Hồ Chí Minh',
    provinceName: 'TP. Hồ Chí Minh',
    cityCode: 'hcm',
    img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80&auto=format&fit=crop',
    className: 'md:col-span-2 md:row-span-2',
  },
  {
    name: 'Hà Nội',
    provinceName: 'Hà Nội',
    cityCode: 'hn',
    img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80&auto=format&fit=crop',
    className: '',
  },
  {
    name: 'Bình Định',
    provinceName: 'Bình Định',
    cityCode: 'bdh',
    img: 'https://images.unsplash.com/photo-1545987796-200677ee1011?w=600&q=80&auto=format&fit=crop',
    className: '',
  },
  {
    name: 'Đà Nẵng',
    provinceName: 'Đà Nẵng',
    cityCode: 'dnang',
    img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80&auto=format&fit=crop',
    className: '',
  },
  {
    name: 'Khánh Hoà',
    provinceName: 'Khánh Hoà',
    cityCode: 'kh',
    img: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=600&q=80&auto=format&fit=crop',
    className: '',
  },
];

interface Props {
  regions?: RegionStat[];
}

export function FeaturedRegionsMasonry({ regions }: Props = {}) {
  const list: RegionStat[] =
    regions ?? REGION_DEFAULTS.map((r) => ({ ...r, count: 0 }));

  return (
    <section className="container-app py-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink sm:text-2xl">Khu vực nổi bật</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Khám phá bất động sản theo tỉnh thành — số tin cập nhật từ API
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[240px]">
        {list.map((r) => (
          <Link
            key={r.cityCode}
            href={`/tin-dang?cityCode=${r.cityCode}`}
            className={`unstyled group relative block overflow-hidden rounded-md border border-brdr shadow-raised ${r.className ?? ''}`}
          >
            <Image
              src={r.img}
              alt={r.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity group-hover:opacity-100">
              <ArrowUpRight size={16} />
            </div>
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <p className="text-base font-semibold sm:text-lg drop-shadow">{r.name}</p>
              <p className="text-xs text-white/85">
                {r.count > 0 ? `${r.count.toLocaleString('vi-VN')} tin đăng` : 'Đang cập nhật'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export { REGION_DEFAULTS };
