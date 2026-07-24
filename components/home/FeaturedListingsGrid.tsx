import Link from 'next/link';
import type { Listing } from '@/types';
import { ListingCard } from '@/components/listing';
import { CardCarousel } from '@/components/ui';
import { ArrowRight } from '@/components/icons';

interface Props {
  title: string;
  description?: string;
  listings: Listing[];
  href?: string;
  /** Hint to load first N images eagerly (only for the top-most section above the fold). */
  priorityCount?: number;
}

export function FeaturedListingsGrid({ title, description, listings, href, priorityCount }: Props) {
  return (
    <section className="container-app py-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink sm:text-2xl">{title}</h2>
          {description && <p className="mt-1 text-sm text-ink-muted">{description}</p>}
        </div>
        {href && (
          <Link
            href={href}
            className="unstyled inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover"
          >
            Xem tất cả <ArrowRight size={14} />
          </Link>
        )}
      </div>
      <CardCarousel
        items={listings.map((l, i) => (
          <ListingCard key={l.id} listing={l} priority={i < (priorityCount ?? 0)} />
        ))}
      />
    </section>
  );
}
