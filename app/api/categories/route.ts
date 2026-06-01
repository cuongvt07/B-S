import { NextResponse } from 'next/server';
import type { ApiResponse, Category } from '@/types';
import { categories } from '@/mocks/data/categories';

export async function GET() {
  const res: ApiResponse<Category[]> = { data: categories };
  return NextResponse.json(res);
}
