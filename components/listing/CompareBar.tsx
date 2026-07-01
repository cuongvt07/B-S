'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { X } from '@/components/icons';
import { useCompare } from '@/lib/hooks/useCompare';
import { listingApi } from '@/lib/api/listings';
import { Button, Skeleton } from '@/components/ui';

function CompareSlot({ id, onRemove }: { id: string; onRemove: () => void }) {
  const { data, isLoading } = useQuery({
    queryKey: ['listings', 'detail', id],
    queryFn: () => listingApi.get(id).then((r) => r.data),
  });

  if (isLoading || !data) return <Skeleton className="h-12 w-12 rounded-sm" />;
  const cover = data.images[0]?.url;

  return (
    <div
      className="group relative h-12 w-12 overflow-hidden rounded-sm border border-brdr"
      title={data.title}
    >
      {cover && (
        <Image src={cover} alt={data.title} fill sizes="48px" className="object-cover" />
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Bỏ khỏi so sánh"
        className="absolute right-0 top-0 grid h-4 w-4 place-items-center rounded-bl-sm bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
      >
        <X size={10} />
      </button>
    </div>
  );
}

function EmptySlot() {
  return (
    <div className="grid h-12 w-12 place-items-center rounded-sm border border-dashed border-brdr text-xs text-ink-muted">
      +
    </div>
  );
}

export function CompareBar() {
  const ids = useCompare((s) => s.ids);
  const toggle = useCompare((s) => s.toggle);
  const clear = useCompare((s) => s.clear);

  if (ids.length === 0) return null;

  const slots = [0, 1, 2];

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-32px)] max-w-3xl -translate-x-1/2 rounded-md border border-brdr bg-white px-4 py-3 shadow-elevated animate-slideUp">
      <div className="flex flex-wrap items-center gap-4">
        <span className="whitespace-nowrap text-sm font-semibold text-ink">
          So sánh ({ids.length}/3)
        </span>
        <div className="flex items-center gap-2">
          {slots.map((i) =>
            ids[i] ? (
              <CompareSlot key={ids[i]} id={ids[i]} onRemove={() => toggle(ids[i])} />
            ) : (
              <EmptySlot key={`empty-${i}`} />
            )
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clear}>
            Xoá
          </Button>
          <Link href="/so-sanh" className="unstyled">
            <Button size="sm">So sánh ngay</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
