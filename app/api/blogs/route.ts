import { NextResponse, type NextRequest } from 'next/server';
import type { PaginatedResponse, Blog } from '@/types';
import { blogs } from '@/mocks/data/blogs';
import { paginate } from '@/mocks/handlers/paginate';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const tag = sp.get('tag');
  const page = Number(sp.get('page') ?? 1);
  const pageSize = Number(sp.get('pageSize') ?? 10);

  let filtered = [...blogs];
  if (tag) {
    filtered = filtered.filter(
      (b) => b.categoryTag.toLowerCase() === tag.toLowerCase() || b.tags.includes(tag)
    );
  }
  filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const result: PaginatedResponse<Blog> = paginate(filtered, page, pageSize);
  return NextResponse.json(result);
}
