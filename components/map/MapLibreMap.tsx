'use client';

import { useEffect, useRef } from 'react';
import {
  Map as MaplibreMap,
  NavigationControl,
  GeolocateControl,
  Popup,
  Marker,
  type FlyToOptions,
  type GeoJSONSource,
  type LngLatLike,
  type MapGeoJSONFeature,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface MapPoint {
  id: string;
  lng: number;
  lat: number;
  title: string;
  price: string;
  priceShort: string;
  /** Raw price in VND (for tier classification). */
  priceVnd?: number;
  /** 'total' = sale (VND), 'month' = rent (VND/tháng). */
  priceUnit?: 'total' | 'month';
  slug: string;
  cover?: string;
  vip?: boolean;
}

// Price tier 1-4 → 4 icons + 4 colour themes
export type PriceTier = 1 | 2 | 3 | 4;

function getPriceTier(p: MapPoint): PriceTier {
  const v = p.priceVnd ?? 0;
  const isRent = p.priceUnit === 'month';
  if (isRent) {
    if (v < 5_000_000) return 1;
    if (v < 15_000_000) return 2;
    if (v < 50_000_000) return 3;
    return 4;
  }
  if (v < 1_500_000_000) return 1;
  if (v < 5_000_000_000) return 2;
  if (v < 15_000_000_000) return 3;
  return 4;
}

// SVG icon path-only (24x24 viewBox) per tier
const TIER_ICON: Record<PriceTier, string> = {
  // 1 - small house (lucide Home)
  1: '<path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  // 2 - house with chimney (lucide Home variant)
  2: '<path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 21V12h6v9" fill="none" stroke="currentColor" stroke-width="2"/>',
  // 3 - building (lucide Building)
  3: '<path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-4h4v4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  // 4 - skyscraper / premium tower (lucide Building2)
  4: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18M2 22h20M10 6h4M10 10h4M10 14h4M10 18h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
};

export type LayerMode = 'cluster' | 'heatmap';
export type StyleId = 'liberty' | 'bright' | 'positron';

export interface FlyToTarget {
  lng: number;
  lat: number;
  zoom?: number;
  key?: number;
}

export interface BoundsInfo {
  ids: string[];
  bounds: { west: number; east: number; south: number; north: number };
}

interface Props {
  points: MapPoint[];
  mode?: LayerMode;
  styleId?: StyleId;
  threeD?: boolean;
  selectedId?: string;
  hoveredId?: string;
  searchAsYouMove?: boolean;
  onSelect?: (id: string) => void;
  onHover?: (id: string | undefined) => void;
  onBoundsChange?: (info: BoundsInfo) => void;
  onMapMoved?: () => void;
  flyTo?: FlyToTarget;
  initialCenter?: [number, number];
  initialZoom?: number;
}

const STYLE_MAP: Record<StyleId, string> = {
  liberty: 'https://tiles.openfreemap.org/styles/liberty',
  bright: 'https://tiles.openfreemap.org/styles/bright',
  positron: 'https://tiles.openfreemap.org/styles/positron',
};

function pointsToFeatureCollection(points: MapPoint[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: points.map((p) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      properties: { id: p.id, vip: p.vip ? 1 : 0 },
    })),
  };
}

function buildPopupHTML(p: MapPoint) {
  const cover = p.cover
    ? `<img src="${p.cover}" alt="" style="width:100%;height:120px;object-fit:cover;display:block" />`
    : '';
  const vip = p.vip
    ? `<span style="position:absolute;top:8px;left:8px;background:#D97706;color:#fff;font-size:10px;font-weight:600;padding:2px 6px;border-radius:4px;">VIP</span>`
    : '';
  return `
    <div style="width:240px;font-family:system-ui,-apple-system,sans-serif">
      <div style="position:relative">${cover}${vip}</div>
      <div style="padding:10px 12px 12px">
        <p style="margin:0;font-size:13px;font-weight:600;color:#313131;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${p.title}</p>
        <p style="margin:6px 0 8px;color:#059669;font-weight:700;font-size:14px">${p.price}</p>
        <a href="/tin-dang/${p.slug}" style="display:inline-block;font-size:12px;font-weight:600;color:#0000EE;text-decoration:none">Xem chi tiết →</a>
      </div>
    </div>`;
}

function makeMarkerElement(p: MapPoint): HTMLDivElement {
  const tier = getPriceTier(p);
  const el = document.createElement('div');
  el.className = 'bds-marker';
  el.dataset.id = p.id;
  el.dataset.vip = p.vip ? '1' : '0';
  el.dataset.tier = String(tier);
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', `Tin đăng giá ${p.price}`);
  // SVG must have xmlns when inserted via innerHTML or it parses as unknown element.
  // Use DOMParser to create the SVG node properly, then append the price span.
  const svgWrap = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgWrap.setAttribute('viewBox', '0 0 24 24');
  svgWrap.setAttribute('width', '14');
  svgWrap.setAttribute('height', '14');
  svgWrap.setAttribute('aria-hidden', 'true');
  svgWrap.innerHTML = TIER_ICON[tier];
  el.appendChild(svgWrap);
  const txt = document.createElement('span');
  txt.textContent = p.priceShort;
  el.appendChild(txt);
  return el;
}

export function MapLibreMap({
  points,
  mode = 'cluster',
  styleId = 'liberty',
  threeD = false,
  selectedId,
  hoveredId,
  searchAsYouMove = true,
  onSelect,
  onHover,
  onBoundsChange,
  onMapMoved,
  flyTo,
  initialCenter = [108.2772, 14.0583],
  initialZoom = 5,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const moveTimerRef = useRef<number | null>(null);
  const visibilityRafRef = useRef<number | null>(null);
  const dataRef = useRef<GeoJSON.FeatureCollection>({ type: 'FeatureCollection', features: [] });
  const pointsRef = useRef<MapPoint[]>([]);
  const styleLoadedRef = useRef(false);
  const didAutoFitRef = useRef(false);
  const onBoundsChangeRef = useRef(onBoundsChange);
  const onSelectRef = useRef(onSelect);
  const onHoverRef = useRef(onHover);
  const onMapMovedRef = useRef(onMapMoved);
  const searchAsYouMoveRef = useRef(searchAsYouMove);

  useEffect(() => {
    onBoundsChangeRef.current = onBoundsChange;
    onSelectRef.current = onSelect;
    onHoverRef.current = onHover;
    onMapMovedRef.current = onMapMoved;
    searchAsYouMoveRef.current = searchAsYouMove;
  });

  // ── init map (one-time) ──
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new MaplibreMap({
      container: containerRef.current,
      style: STYLE_MAP[styleId],
      center: initialCenter as LngLatLike,
      zoom: initialZoom,
      attributionControl: { compact: true },
      fadeDuration: 200,
    });
    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(
      new GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: false,
      }),
      'top-right'
    );
    mapRef.current = map;

    function emitBounds(force = false) {
      if (moveTimerRef.current) window.clearTimeout(moveTimerRef.current);
      moveTimerRef.current = window.setTimeout(() => {
        if (!force && !searchAsYouMoveRef.current) return;
        const cb = onBoundsChangeRef.current;
        if (!cb) return;
        const bounds = map.getBounds();
        const insideIds: string[] = [];
        for (const ft of dataRef.current.features) {
          const c = (ft.geometry as GeoJSON.Point).coordinates as [number, number];
          if (
            c[0] >= bounds.getWest() &&
            c[0] <= bounds.getEast() &&
            c[1] >= bounds.getSouth() &&
            c[1] <= bounds.getNorth()
          ) {
            insideIds.push(ft.properties?.id as string);
          }
        }
        cb({
          ids: insideIds,
          bounds: {
            west: bounds.getWest(),
            east: bounds.getEast(),
            south: bounds.getSouth(),
            north: bounds.getNorth(),
          },
        });
      }, 250);
    }

    // expose for the manual "Tìm khu vực này" trigger
    (map as unknown as { __emitBoundsNow?: () => void }).__emitBoundsNow = () => emitBounds(true);

    function scheduleMarkerVisibility() {
      if (visibilityRafRef.current) cancelAnimationFrame(visibilityRafRef.current);
      visibilityRafRef.current = requestAnimationFrame(() => updateMarkerVisibility(map));
    }

    map.on('load', () => {
      styleLoadedRef.current = true;
      addLayers(map);
      // attach markers for current data
      syncMarkers(map);
      updateMarkerVisibility(map);
      emitBounds(true);
    });

    map.on('moveend', () => {
      emitBounds();
      onMapMovedRef.current?.();
    });
    map.on('move', scheduleMarkerVisibility);
    map.on('zoom', scheduleMarkerVisibility);
    map.on('idle', () => updateMarkerVisibility(map));

    return () => {
      if (moveTimerRef.current) window.clearTimeout(moveTimerRef.current);
      if (visibilityRafRef.current) cancelAnimationFrame(visibilityRafRef.current);
      popupRef.current?.remove();
      for (const m of markersRef.current.values()) m.remove();
      markersRef.current.clear();
      map.remove();
      mapRef.current = null;
      styleLoadedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addLayers(map: MaplibreMap) {
    if (map.getSource('listings')) return;

    // Vietnam-sovereign archipelagos overlay — always visible at every zoom.
    // OpenFreeMap/OSM thường không hiển thị 2 quần đảo này; ta luôn vẽ overlay.
    if (!map.getSource('vn-archipelagos')) {
      map.addSource('vn-archipelagos', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [111.92, 16.5] },
              // Newline trong property string → MapLibre render thành 2 dòng
              properties: { name: 'QUẦN ĐẢO HOÀNG SA\n(Việt Nam)' },
            },
            {
              type: 'Feature',
              geometry: { type: 'Point', coordinates: [114.0, 10.5] },
              properties: { name: 'QUẦN ĐẢO TRƯỜNG SA\n(Việt Nam)' },
            },
          ],
        },
      });

      // Halo glow đỏ — vùng chủ quyền (luôn dưới label)
      map.addLayer({
        id: 'vn-arch-halo',
        type: 'circle',
        source: 'vn-archipelagos',
        paint: {
          'circle-color': '#DC2626',
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 16, 6, 28, 10, 40],
          'circle-opacity': 0.18,
          'circle-blur': 0.4,
        },
      });

      // Dot chính
      map.addLayer({
        id: 'vn-arch-dot',
        type: 'circle',
        source: 'vn-archipelagos',
        paint: {
          'circle-color': '#DC2626',
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 4, 6, 7, 10, 10],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
        },
      });

      // Label — đỏ đậm, halo trắng dày, luôn hiển thị
      map.addLayer({
        id: 'vn-arch-label',
        type: 'symbol',
        source: 'vn-archipelagos',
        layout: {
          'text-field': '{name}',
          'text-font': ['Noto Sans Bold'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 3, 11, 6, 13, 10, 15],
          'text-anchor': 'top',
          'text-offset': [0, 1],
          'text-allow-overlap': true,
          'text-ignore-placement': true,
          'text-letter-spacing': 0.05,
          'text-line-height': 1.1,
        },
        paint: {
          'text-color': '#DC2626',
          'text-halo-color': '#ffffff',
          'text-halo-width': 2.5,
          'text-halo-blur': 0.3,
        },
      });
    }

    map.addSource('listings', {
      type: 'geojson',
      data: dataRef.current,
      cluster: true,
      clusterMaxZoom: 13,
      clusterRadius: 55,
    });

    map.addLayer({
      id: 'clusters-halo',
      type: 'circle',
      source: 'listings',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#0000EE',
        'circle-radius': ['step', ['get', 'point_count'], 28, 10, 36, 30, 46],
        'circle-opacity': 0.18,
      },
    });
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'listings',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': ['step', ['get', 'point_count'], '#0000EE', 10, '#0000CC', 30, '#0000AA'],
        'circle-radius': ['step', ['get', 'point_count'], 20, 10, 26, 30, 34],
        'circle-stroke-width': 3,
        'circle-stroke-color': '#fff',
      },
    });
    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'listings',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Noto Sans Bold'],
        'text-size': 14,
        'text-allow-overlap': true,
      },
      paint: { 'text-color': '#fff' },
    });

    // Invisible layer used purely as a "query target" for unclustered features
    map.addLayer({
      id: 'unclustered-anchor',
      type: 'circle',
      source: 'listings',
      filter: ['!', ['has', 'point_count']],
      paint: { 'circle-radius': 1, 'circle-opacity': 0 },
    });

    map.addLayer({
      id: 'listings-heat',
      type: 'heatmap',
      source: 'listings',
      layout: { visibility: 'none' },
      paint: {
        'heatmap-weight': ['interpolate', ['linear'], ['get', 'point_count'], 1, 0.5, 50, 1],
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 5, 0.6, 14, 2],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(0,0,238,0)',
          0.2, 'rgba(5,150,105,0.5)',
          0.4, 'rgba(217,119,6,0.6)',
          0.7, 'rgba(220,38,38,0.7)',
          1, 'rgba(190,18,60,0.85)',
        ],
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 5, 12, 14, 36],
        'heatmap-opacity': 0.8,
      },
    });

    if (map.getSource('openmaptiles')) {
      map.addLayer({
        id: 'buildings-3d',
        source: 'openmaptiles',
        'source-layer': 'building',
        type: 'fill-extrusion',
        minzoom: 14,
        layout: { visibility: 'none' },
        paint: {
          'fill-extrusion-color': '#cfd1d4',
          'fill-extrusion-height': [
            'case',
            ['has', 'render_height'],
            ['to-number', ['get', 'render_height']],
            ['has', 'height'],
            ['to-number', ['get', 'height']],
            8,
          ],
          'fill-extrusion-base': 0,
          'fill-extrusion-opacity': 0.85,
        },
      });
    }

    map.on('click', 'clusters', async (e) => {
      const feat = e.features?.[0] as MapGeoJSONFeature | undefined;
      if (!feat) return;
      const clusterId = feat.properties.cluster_id as number;
      const src = map.getSource('listings') as GeoJSONSource;
      try {
        const zoom = await src.getClusterExpansionZoom(clusterId);
        const coords = (feat.geometry as GeoJSON.Point).coordinates as [number, number];
        map.easeTo({ center: coords as LngLatLike, zoom, duration: 600 });
      } catch {}
    });
    map.on('mouseenter', 'clusters', () => (map.getCanvas().style.cursor = 'pointer'));
    map.on('mouseleave', 'clusters', () => (map.getCanvas().style.cursor = ''));
  }

  function syncMarkers(map: MaplibreMap) {
    const seen = new Set<string>();
    for (const p of pointsRef.current) {
      seen.add(p.id);
      let m = markersRef.current.get(p.id);
      if (!m) {
        const el = makeMarkerElement(p);
        el.addEventListener('click', (ev) => {
          ev.stopPropagation();
          onSelectRef.current?.(p.id);
        });
        el.addEventListener('mouseenter', () => onHoverRef.current?.(p.id));
        el.addEventListener('mouseleave', () => onHoverRef.current?.(undefined));
        m = new Marker({ element: el, anchor: 'bottom' }).setLngLat([p.lng, p.lat]).addTo(map);
        markersRef.current.set(p.id, m);
      } else {
        m.setLngLat([p.lng, p.lat]);
        const el = m.getElement();
        el.textContent = p.priceShort;
        el.dataset.vip = p.vip ? '1' : '0';
      }
    }
    for (const [id, m] of markersRef.current.entries()) {
      if (!seen.has(id)) {
        m.remove();
        markersRef.current.delete(id);
      }
    }
  }

  function updateMarkerVisibility(map: MaplibreMap) {
    if (!map.isStyleLoaded()) return;
    if (!map.getLayer('unclustered-anchor')) return;
    const features = map.queryRenderedFeatures(undefined, { layers: ['unclustered-anchor'] });
    const visible = new Set<string>();
    for (const f of features) {
      const id = f.properties?.id as string;
      if (id) visible.add(id);
    }
    for (const [id, m] of markersRef.current.entries()) {
      const show = visible.has(id);
      m.getElement().style.display = show ? '' : 'none';
    }
  }

  // ── Data update ──
  useEffect(() => {
    pointsRef.current = points;
    const fc = pointsToFeatureCollection(points);
    dataRef.current = fc;
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const src = map.getSource('listings') as GeoJSONSource | undefined;
      if (src) src.setData(fc);
      syncMarkers(map);
      updateMarkerVisibility(map);

      // Auto-fit on the first non-empty data load so the map opens zoomed
      // to where the listings actually are (rather than the whole country).
      // Critical on mobile where the default 5.5 zoom is too far out to read detail.
      if (!didAutoFitRef.current && points.length > 0) {
        didAutoFitRef.current = true;
        let west = Infinity, east = -Infinity, south = Infinity, north = -Infinity;
        for (const p of points) {
          if (p.lng < west) west = p.lng;
          if (p.lng > east) east = p.lng;
          if (p.lat < south) south = p.lat;
          if (p.lat > north) north = p.lat;
        }
        if (Number.isFinite(west) && Number.isFinite(east)) {
          const isMobile = window.innerWidth < 768;
          map.fitBounds(
            [[west, south], [east, north]],
            { padding: isMobile ? 60 : 80, maxZoom: 14, duration: 600 }
          );
        }
      }
    };
    if (styleLoadedRef.current) apply();
    else map.once('load', apply);
  }, [points]);

  // ── Style swap ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(STYLE_MAP[styleId]);
    styleLoadedRef.current = false;
    map.once('styledata', () => {
      styleLoadedRef.current = true;
      addLayers(map);
      syncMarkers(map);
      updateMarkerVisibility(map);
    });
  }, [styleId]);

  // ── Mode toggle (cluster / heatmap) ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const heat = mode === 'heatmap';
      const setVis = (id: string, v: boolean) => {
        if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', v ? 'visible' : 'none');
      };
      ['clusters-halo', 'clusters', 'cluster-count'].forEach((l) => setVis(l, !heat));
      setVis('listings-heat', heat);
      // Hide all HTML markers in heatmap mode
      for (const m of markersRef.current.values()) {
        m.getElement().style.display = heat ? 'none' : '';
      }
      if (!heat) updateMarkerVisibility(map);
    };
    if (styleLoadedRef.current) apply();
    else map.once('load', apply);
  }, [mode]);

  // ── 3D ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      if (map.getLayer('buildings-3d'))
        map.setLayoutProperty('buildings-3d', 'visibility', threeD ? 'visible' : 'none');
      map.easeTo({ pitch: threeD ? 50 : 0, duration: 600 });
    };
    if (styleLoadedRef.current) apply();
    else map.once('load', apply);
  }, [threeD]);

  // ── Selected → fly to + class ──
  useEffect(() => {
    for (const [id, m] of markersRef.current.entries()) {
      m.getElement().classList.toggle('is-selected', id === selectedId);
    }
    const map = mapRef.current;
    if (!map || !selectedId) return;
    const p = pointsRef.current.find((pt) => pt.id === selectedId);
    if (p)
      map.easeTo({
        center: [p.lng, p.lat] as LngLatLike,
        zoom: Math.max(map.getZoom(), 14),
        duration: 600,
      });
  }, [selectedId]);

  // ── Hovered → class ──
  useEffect(() => {
    for (const [id, m] of markersRef.current.entries()) {
      m.getElement().classList.toggle('is-hovered', id === hoveredId);
    }
  }, [hoveredId]);

  // ── External flyTo ──
  useEffect(() => {
    if (!flyTo) return;
    const map = mapRef.current;
    if (!map) return;
    const target: FlyToOptions = {
      center: [flyTo.lng, flyTo.lat] as LngLatLike,
      zoom: flyTo.zoom ?? 12,
      duration: 1200,
      essential: true,
    };
    if (styleLoadedRef.current) map.flyTo(target);
    else map.once('load', () => map.flyTo(target));
  }, [flyTo]);

  return <div ref={containerRef} className="h-full w-full" />;
}

/** Imperative helper: force emit current bounds (used by "Tìm khu vực này" button). */
export function emitMapBoundsNow(_map: MaplibreMap | null) {
  if (!_map) return;
  (_map as unknown as { __emitBoundsNow?: () => void }).__emitBoundsNow?.();
}
