import { NextResponse } from 'next/server';
import type { ApiResponse, City } from '@/types';
import { cities } from '@/mocks/data/cities';

export async function GET() {
  const res: ApiResponse<City[]> = { data: cities };
  return NextResponse.json(res);
}
