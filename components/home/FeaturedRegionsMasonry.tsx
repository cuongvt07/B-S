import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { listings } from '@/mocks/data/listings';

const REGIONS = [
  {
    name: 'TP. Hồ Chí Minh',
    cityCode: 'hcm',
    img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80&auto=format&fit=crop',
    className: 'md:col-span-2 md:row-span-2',
  },
  {
    name: 'Hà Nội',
    cityCode: 'hn',
    img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80&auto=format&fit=crop',
    className: '',
  },
  {
    name: 'Bình Dương',
    cityCode: 'bd',
    img: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=600&q=80&auto=format&fit=crop',
    className: '',
  },
  {
    name: 'Đồng Nai',
    cityCode: 'dn',
    img: 'https://images.unsplash.com/photo-1545987796-200677ee1011?w=600&q=80&auto=format&fit=crop',
    className: '',
  },
  {
    name: 'Đà Nẵng',
    cityCode: 'dnang',
    img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80&auto=format&fit=crop',
    className: '',
  },
];

function countByCity(cityCode: string): number {
  return listings.filter((l) => l.cityCode === cityCode).length;
}

export function FeaturedRegionsMasonry() {
  return (
    <section className="container-app py-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink sm:text-2xl">Khu vực nổi bật</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Khám phá bất động sản tại các thành phố lớn của Việt Nam
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[240px]">
        {REGIONS.map((r) => {
          const count = countByCity(r.cityCode);
          return (
            <Link
              key={r.cityCode}
              href={`/tin-dang?cityCode=${r.cityCode}`}
              className={`unstyled group relative block overflow-hidden rounded-md border border-brdr shadow-raised ${r.className}`}
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
                  {count > 0 ? `${count} tin đăng` : 'Sắp ra mắt'}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
