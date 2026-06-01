import { NextResponse } from 'next/server';
import type { ApiResponse, Blog } from '@/types';
import { blogBySlug } from '@/mocks/data/blogs';

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  const blog = blogBySlug.get(params.slug);
  if (!blog) {
    return NextResponse.json({ message: 'Không tìm thấy bài viết' }, { status: 404 });
  }
  const res: ApiResponse<Blog> = { data: blog };
  return NextResponse.json(res);
}
