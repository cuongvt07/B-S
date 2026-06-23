import Link from 'next/link';
import { SITE } from '@/lib/constants';

/**
 * Logo — solid navy mark with a building silhouette. Kept intentionally simple.
 */
export function Logo({
  compact = false,
  logoUrl,
  siteName = SITE.name,
}: {
  compact?: boolean;
  logoUrl?: string;
  siteName?: string;
}) {
  // Custom logo configured in the CMS — render the image instead of the SVG mark.
  if (logoUrl) {
    return (
      <Link
        href="/"
        className="unstyled group inline-flex shrink-0 items-center whitespace-nowrap"
        aria-label={siteName}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={siteName}
          className="h-9 w-auto max-w-[180px] object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className="unstyled group inline-flex shrink-0 items-center gap-2 whitespace-nowrap font-semibold text-ink"
      aria-label={siteName}
    >
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-md transition-transform duration-200 group-hover:scale-105"
        style={{ background: '#0a1f44' }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M3 11.5 L12 4 L21 11.5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect
            x="5.5"
            y="11"
            width="13"
            height="9"
            rx="0.6"
            stroke="white"
            strokeWidth="1.6"
            fill="rgba(255,255,255,0.06)"
          />
          <rect x="10.5" y="14" width="3" height="6" fill="#f59e0b" />
          <rect x="7.5" y="13.5" width="1.6" height="1.6" fill="white" />
          <rect x="14.9" y="13.5" width="1.6" height="1.6" fill="white" />
        </svg>
      </span>
      {!compact && (
        <span className="text-lg font-bold tracking-tight text-ink group-hover:text-primary transition-colors">
          {siteName}
        </span>
      )}
    </Link>
  );
}
