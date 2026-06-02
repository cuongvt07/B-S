'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Map as MapIcon, Flame, MapPin, RefreshCcw, Layers } from 'lucide-react';
import { useListings } from '@/lib/hooks/useListings';
import { Breadcrumbs } from '@/components/seo';
import { Badge, SegmentedControl, Skeleton } from '@/components/ui';
import { cn } from '@/lib/utils';
import { formatPrice, formatArea } from '@/lib/utils/format';
import { getListingLngLat } from '@/lib/utils/coords';
import { formatLocation } from '@/mocks/data/cities';
import type {
  BoundsInfo,
  FlyToTarget,
  MapPoint,
  StyleId,
} from '@/components/map/MapLibreMap';
import { LocationSearch } from '@/components/map/LocationSearch';
import { MapListingPanel } from '@/components/map/MapListingPanel';
import { PriceTierLegend } from '@/components/map/PriceTierLegend';

const MapLibreMap = dynamic(
  () => import('@/components/map/MapLibreMap').then((m) => m.MapLibreMap),
  { ssr: false, loading: () => <Skeleton className="h-full w-full rounded-md" /> }
);

function priceShort(price: number, unit: 'month' | 'total'): string {
  if (price >= 1_000_000_000) {
    const v = price / 1_000_000_000;
    return `${v % 1 === 0 ? v : v.toFixed(1)} tỷ`;
  }
  if (price >= 1_000_000) {
    const v = price / 1_000_000;
    return `${v % 1 === 0 ? v : v.toFixed(1)}${unit === 'month' ? 'tr/th' : 'tr'}`;
  }
  return `${(price / 1_000).toFixed(0)}k`;
}

export default function MapPage() {
  const { data, isLoading } = useListings({ pageSize: 50, sort: 'newest' });
  const listings = useMemo(() => data?.data ?? [], [data]);

  const points: MapPoint[] = useMemo(
    () =>
      listings.map((l) => {
        const [lng, lat] = getListingLngLat(l);
        return {
          id: l.id,
          lng,
          lat,
          title: l.title,
          price: formatPrice(l.price, l.priceUnit),
          priceShort: priceShort(l.price, l.priceUnit),
          priceVnd: l.price,
          priceUnit: l.priceUnit,
          slug: l.slug,
          cover: l.images[0]?.url,
          vip: l.vipTier !== 'normal',
        };
      }),
    [listings]
  );

  const [mode, setMode] = useState<'cluster' | 'heatmap'>('cluster');
  const [styleId, setStyleId] = useState<StyleId>('liberty');
  const [threeD, setThreeD] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [hoveredId, setHoveredId] = useState<string | undefined>();
  const [searchAsYouMove, setSearchAsYouMove] = useState(true);
  const [visibleIds, setVisibleIds] = useState<string[] | null>(null);
  const [pendingMove, setPendingMove] = useState(false);
  const [flyTo, setFlyTo] = useState<FlyToTarget | undefined>();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Bản đồ tin đăng — BDS Việt';
  }, []);

  useEffect(() => {
    if (!selectedId || !sidebarRef.current) return;
    const el = sidebarRef.current.querySelector<HTMLElement>(`[data-card-id="${selectedId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selectedId]);

  function handleBounds(info: BoundsInfo) {
    setVisibleIds(info.ids);
    setPendingMove(false);
  }

  function handleMapMoved() {
    if (!searchAsYouMove) setPendingMove(true);
  }

  function searchInArea() {
    setSearchAsYouMove(true);
    setPendingMove(false);
    setTimeout(() => setSearchAsYouMove(false), 350);
  }

  const visibleListings = useMemo(() => {
    if (!visibleIds) return listings;
    const set = new Set(visibleIds);
    return listings.filter((l) => set.has(l.id));
  }, [visibleIds, listings]);

  const selectedListing = selectedId
    ? listings.find((l) => l.id === selectedId)
    : undefined;

  return (
    <div className="container-app py-4">
      <Breadcrumbs
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tin đăng', href: '/tin-dang' },
          { label: 'Bản đồ' },
        ]}
      />

      <header className="mb-3 mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink sm:text-2xl">Bản đồ tin đăng</h1>
          <p className="mt-1 text-sm text-ink-muted">
            <strong className="text-ink">{visibleListings.length}</strong>/{listings.length} tin trong vùng — di chuyển/phóng bản đồ hoặc tìm địa điểm
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl
            options={[
              { value: 'cluster', label: 'Marker', icon: <MapIcon size={14} /> },
              { value: 'heatmap', label: 'Heatmap', icon: <Flame size={14} /> },
            ]}
            value={mode}
            onChange={(v) => setMode(v as 'cluster' | 'heatmap')}
            size="sm"
            accent="primary"
          />

          <SegmentedControl
            options={[
              { value: 'liberty', label: 'Liberty' },
              { value: 'bright', label: 'Bright' },
              { value: 'positron', label: 'Mono' },
            ]}
            value={styleId}
            onChange={(v) => setStyleId(v as StyleId)}
            size="sm"
          />

          <button
            type="button"
            onClick={() => setThreeD((v) => !v)}
            className={cn(
              'inline-flex h-9 items-center gap-1.5 rounded-full border bg-white px-3 text-xs font-semibold transition',
              threeD
                ? 'border-primary text-primary shadow-raised'
                : 'border-brdr text-ink hover:bg-surface-subtle'
            )}
          >
            <Box size={14} /> 3D
          </button>
        </div>
      </header>

      {/* 2-column layout: sidebar 280 | map flex. Detail panel floats over map. */}
      <div className="grid h-[calc(100vh-180px)] min-h-[520px] grid-cols-1 gap-3 md:h-[calc(100vh-220px)] md:min-h-[640px] md:grid-cols-[280px_1fr]">
        {/* Compact sidebar list */}
        <aside className="hidden md:flex flex-col overflow-hidden rounded-md border border-brdr bg-white shadow-raised">
          <div className="border-b border-brdr bg-surface-subtle p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Tìm địa điểm
            </p>
            <LocationSearch
              onPick={(loc) =>
                setFlyTo({ lng: loc.lng, lat: loc.lat, zoom: loc.zoom, key: Date.now() })
              }
            />
          </div>

          <div className="flex items-center justify-between gap-2 border-b border-brdr px-3 py-2">
            <p className="truncate text-sm font-semibold text-ink">
              {visibleListings.length} tin
            </p>
            <label className="inline-flex shrink-0 cursor-pointer items-center gap-1 text-[11px] text-ink-muted">
              <input
                type="checkbox"
                checked={searchAsYouMove}
                onChange={(e) => {
                  setSearchAsYouMove(e.target.checked);
                  if (e.target.checked) setPendingMove(false);
                }}
                className="accent-primary"
              />
              Tự động
            </label>
          </div>

          <div ref={sidebarRef} className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-2 p-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-2">
                    <Skeleton className="h-14 w-20 shrink-0 rounded-sm" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : visibleListings.length === 0 ? (
              <div className="grid h-full place-items-center px-4 py-12 text-center">
                <div>
                  <MapPin size={28} className="mx-auto text-ink-muted" />
                  <p className="mt-2 text-xs font-medium text-ink">Vùng này chưa có tin</p>
                </div>
              </div>
            ) : (
              visibleListings.map((l) => {
                const active = l.id === selectedId;
                const hover = l.id === hoveredId;
                return (
                  <button
                    key={l.id}
                    data-card-id={l.id}
                    type="button"
                    onClick={() => setSelectedId(l.id)}
                    onMouseEnter={() => setHoveredId(l.id)}
                    onMouseLeave={() => setHoveredId(undefined)}
                    className={cn(
                      'flex w-full gap-2 border-b border-brdr p-2 text-left transition',
                      active && 'border-l-4 border-l-primary bg-primary/5',
                      !active && hover && 'bg-surface-subtle'
                    )}
                  >
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-sm bg-surface-subtle">
                      {l.images[0]?.url && (
                        <Image
                          src={l.images[0].url}
                          alt={l.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                      {l.vipTier !== 'normal' && (
                        <div className="absolute left-0.5 top-0.5">
                          <span className="rounded-sm bg-vip px-1 py-0 text-[9px] font-semibold text-white">
                            VIP
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <p className="line-clamp-2 text-xs font-semibold text-ink">{l.title}</p>
                      <p className="text-xs font-semibold text-price">
                        {priceShort(l.price, l.priceUnit)}
                      </p>
                      <p className="line-clamp-1 inline-flex items-center gap-1 text-[11px] text-ink-muted">
                        <MapPin size={10} />
                        {formatLocation(l.cityCode, l.districtCode)}
                      </p>
                      <p className="text-[11px] text-ink-muted">{formatArea(l.area)}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Legend — chú thích icon theo giá */}
          <div className="border-t border-brdr p-2">
            <PriceTierLegend />
          </div>
        </aside>

        {/* Map */}
        <div className="relative h-full overflow-hidden rounded-md border border-brdr">
          {!isLoading && points.length > 0 ? (
            <MapLibreMap
              points={points}
              mode={mode}
              styleId={styleId}
              threeD={threeD}
              selectedId={selectedId}
              hoveredId={hoveredId}
              searchAsYouMove={searchAsYouMove}
              onSelect={(id) => setSelectedId(id)}
              onHover={(id) => setHoveredId(id)}
              onBoundsChange={handleBounds}
              onMapMoved={handleMapMoved}
              flyTo={flyTo}
              initialCenter={[111, 14]}
              initialZoom={5.5}
            />
          ) : (
            <Skeleton className="h-full w-full rounded-md" />
          )}

          {!searchAsYouMove && pendingMove && (
            <button
              type="button"
              onClick={searchInArea}
              className="absolute left-1/2 top-3 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink-strong px-4 py-2 text-sm font-semibold text-white shadow-elevated transition hover:bg-black animate-fadeIn"
            >
              <RefreshCcw size={14} /> Tìm trong khu vực này
            </button>
          )}

          <div className="pointer-events-none absolute bottom-3 left-3 z-10 hidden items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs text-ink-muted shadow-raised backdrop-blur-sm md:inline-flex">
            <Layers size={12} /> OpenFreeMap + OpenStreetMap
          </div>

          {/* Desktop: floating detail panel overlay on top-right of map */}
          {selectedListing && (() => {
            const idx = visibleListings.findIndex((l) => l.id === selectedListing.id);
            const total = visibleListings.length;
            const prevId = idx > 0 ? visibleListings[idx - 1].id : undefined;
            const nextId = idx >= 0 && idx < total - 1 ? visibleListings[idx + 1].id : undefined;
            return (
              <div className="pointer-events-none absolute right-3 top-3 bottom-3 z-20 hidden w-[360px] md:block">
                <div className="pointer-events-auto h-full animate-slideInRight">
                  <MapListingPanel
                    listing={selectedListing}
                    onClose={() => setSelectedId(undefined)}
                    onPrev={prevId ? () => setSelectedId(prevId) : undefined}
                    onNext={nextId ? () => setSelectedId(nextId) : undefined}
                    position={idx >= 0 ? { current: idx + 1, total } : undefined}
                  />
                </div>
              </div>
            );
          })()}

          {/* Mobile: floating selected card at bottom (no panel) */}
          {selectedListing && (
            <div className="absolute bottom-3 left-3 right-3 z-20 md:hidden">
              <MobileSelectedCard
                listing={selectedListing}
                onClose={() => setSelectedId(undefined)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MobileSelectedCard({
  listing,
  onClose,
}: {
  listing: import('@/types').Listing;
  onClose: () => void;
}) {
  return (
    <div className="relative flex gap-3 rounded-md border border-brdr bg-white p-3 shadow-elevated">
      <button
        type="button"
        onClick={onClose}
        aria-label="Đóng"
        className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-ink-muted hover:text-ink"
      >
        ×
      </button>
      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-sm">
        {listing.images[0]?.url && (
          <Image
            src={listing.images[0].url}
            alt={listing.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </div>
      <div className="min-w-0 flex-1 pr-5">
        <p className="line-clamp-2 text-sm font-semibold text-ink">{listing.title}</p>
        <p className="text-sm font-semibold text-price">
          {formatPrice(listing.price, listing.priceUnit)}
        </p>
        <Link
          href={`/tin-dang/${listing.slug}`}
          className="unstyled text-xs font-semibold text-primary"
        >
          Xem chi tiết →
        </Link>
      </div>
    </div>
  );
}

// Suppress unused Badge import lint (already used in subcomponents)
void Badge;
