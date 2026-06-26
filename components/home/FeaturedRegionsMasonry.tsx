import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

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
    cityCode: '52',
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
    <section className="featured-regions">
      <div className="container-app">
        <div className="featured-regions__grid">
          <div className="featured-regions__intro">
            <span>Điểm đến nổi bật</span>
            <h2 className="uppercase">Khu vực bất động sản nổi bật</h2>
            <p>
              Khám phá những khu vực có thị trường sôi động, nhiều lựa chọn và tiềm
              năng phù hợp cho nhu cầu an cư hoặc đầu tư.
            </p>
            <Link href="/tin-dang" className="unstyled featured-regions__cta">
              Xem tất cả tin đăng <ArrowRight size={16} />
            </Link>
          </div>

          {list.map((region, index) => (
            <Link
              key={region.cityCode}
              href={`/tin-dang?cityCode=${region.cityCode}`}
              className={`unstyled featured-regions__card featured-regions__card--${index + 1}`}
            >
              <Image
                src={region.img}
                alt={region.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
              <div className="featured-regions__shade" />
              <div className="featured-regions__head">
                <small>
                  {region.count > 0
                    ? `${region.count.toLocaleString('vi-VN')} tin đăng`
                    : 'Đang cập nhật'}
                </small>
                <strong>{region.name}</strong>
              </div>
              <span className="featured-regions__more">
                Xem chi tiết <ArrowUpRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export { REGION_DEFAULTS };
