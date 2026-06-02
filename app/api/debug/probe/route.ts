/**
 * Debug endpoint — probes the upstream Laravel API and returns diagnostic info.
 * Hit https://<your-deploy>.vercel.app/api/debug/probe to see what's happening.
 */
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// `||` not `??` — empty-string env vars on Vercel should fall back to default.
const REAL_HOST = process.env.NEXT_PUBLIC_REAL_API_URL || 'https://vmphuthinhland.com';

interface ProbeResult {
  ok: boolean;
  status?: number;
  statusText?: string;
  elapsedMs: number;
  bodyPreview?: string;
  itemCount?: number;
  metaTotal?: number;
  errorName?: string;
  errorMessage?: string;
  errorCause?: string;
}

async function probe(url: string, init: RequestInit): Promise<ProbeResult> {
  const start = Date.now();
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12_000);
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    clearTimeout(timer);
    const elapsedMs = Date.now() - start;
    const text = await res.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      // not JSON
    }
    const data = (parsed as { data?: unknown[]; meta?: { total?: number } } | undefined) ?? undefined;
    return {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      elapsedMs,
      bodyPreview: text.slice(0, 300),
      itemCount: Array.isArray(data?.data) ? data!.data!.length : undefined,
      metaTotal: typeof data?.meta?.total === 'number' ? data!.meta!.total : undefined,
    };
  } catch (err) {
    const elapsedMs = Date.now() - start;
    const e = err as { name?: string; message?: string; cause?: unknown };
    return {
      ok: false,
      elapsedMs,
      errorName: e.name,
      errorMessage: e.message,
      errorCause: e.cause ? String(e.cause) : undefined,
    };
  }
}

export async function GET() {
  const url1 = `${REAL_HOST}/api/v1/listings?per_page=8&sort_by=created_at&sort_order=desc`;
  const url2 = `${REAL_HOST}/api/v1/listings?per_page=1`;

  const [withUA, plain, noQuery] = await Promise.all([
    probe(url1, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; BDSBot/1.0)',
      },
      cache: 'no-store',
    }),
    probe(url1, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    }),
    probe(url2, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    }),
  ]);

  return NextResponse.json(
    {
      env: {
        NEXT_PUBLIC_REAL_API_URL: process.env.NEXT_PUBLIC_REAL_API_URL ?? null,
        VERCEL: process.env.VERCEL ?? null,
        VERCEL_ENV: process.env.VERCEL_ENV ?? null,
        VERCEL_REGION: process.env.VERCEL_REGION ?? null,
        NODE_ENV: process.env.NODE_ENV ?? null,
      },
      targetHost: REAL_HOST,
      urlTested: url1,
      results: {
        'with-user-agent': withUA,
        'without-user-agent': plain,
        'no-query': noQuery,
      },
      hint:
        withUA.ok
          ? 'Fetch works from Vercel. Issue is elsewhere — check the page render.'
          : withUA.errorName === 'AbortError'
          ? 'Request timed out from Vercel. Upstream may be blocking foreign IPs.'
          : withUA.status === 403 || withUA.status === 401
          ? 'Upstream returned 403/401 — possibly blocking the Vercel IP/UA.'
          : 'Fetch failed — see errorMessage / errorCause for details.',
    },
    { status: 200 }
  );
}
