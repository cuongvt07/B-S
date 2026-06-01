import Link from 'next/link';
import { Home } from 'lucide-react';
import { SITE } from '@/lib/constants';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="unstyled inline-flex shrink-0 items-center gap-2 whitespace-nowrap font-semibold text-ink hover:text-primary"
    >
      <span className="grid h-8 w-8 place-items-center rounded-sm bg-primary text-white">
        <Home size={18} />
      </span>
      {!compact && <span className="text-lg">{SITE.name}</span>}
    </Link>
  );
}
