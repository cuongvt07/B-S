'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { useSearchSuggest } from '@/lib/hooks/useSearchSuggest';
import { Spinner } from '@/components/ui';
import { formatPrice } from '@/lib/utils/format';

interface Props {
  q: string;
  visible: boolean;
  onSelect?: () => void;
}

export function SearchSuggestions({ q, visible, onSelect }: Props) {
  const router = useRouter();
  const { data, isLoading } = useSearchSuggest(q);

  if (!visible || q.trim().length < 1) return null;

  const locations = data?.data.locations ?? [];
  const listings = data?.data.listings ?? [];
  const isEmpty = !isLoading && locations.length === 0 && listings.length === 0;

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[420px] overflow-y-auto rounded-md border border-brdr bg-white shadow-elevated animate-fadeIn">
      {isLoading && (
        <div className="flex items-center justify-center gap-2 p-4 text-sm text-ink-muted">
          <Spinner size={16} /> Đang tìm...
        </div>
      )}

      {isEmpty && (
        <p className="p-4 text-center text-sm text-ink-muted">
          Không tìm thấy gợi ý cho &ldquo;{q}&rdquo;
        </p>
      )}

      {locations.length > 0 && (
        <div>
          <div className="bg-surface-subtle px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Địa điểm
          </div>
          {locations.map((loc, i) => {
            const path = `/tin-dang?cityCode=${loc.cityCode}${
              loc.districtCode ? `&districtCode=${loc.districtCode}` : ''
            }`;
            return (
              <button
                key={`${loc.cityCode}-${loc.districtCode ?? 'city'}-${i}`}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  router.push(path);
                  onSelect?.();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink hover:bg-surface-subtle"
              >
                <MapPin size={14} className="text-ink-muted" />
                <span className="flex-1">{loc.label}</span>
                <span className="ml-auto text-xs text-ink-muted">
                  {loc.type === 'district' ? 'Quận/Huyện' : 'Tỉnh/TP'}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {listings.length > 0 && (
        <div>
          <div className="bg-surface-subtle px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Tin đăng
          </div>
          {listings.map((l) => (
            <Link
              key={l.id}
              href={`/tin-dang/${l.slug}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={onSelect}
              className="unstyled flex items-center gap-3 px-3 py-2 hover:bg-surface-subtle"
            >
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-sm bg-surface-subtle">
                {l.cover && (
                  <Image
                    src={l.cover}
                    alt={l.title}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-semibold text-ink">{l.title}</p>
                <p className="text-xs font-semibold text-price">
                  {formatPrice(l.price, l.priceUnit)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
