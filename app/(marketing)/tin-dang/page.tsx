import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SearchResults } from '@/components/search/SearchResults';

export const metadata: Metadata = {
  title: 'Tin đăng bất động sản',
  description:
    'Tìm kiếm tin đăng cho thuê, mua bán bất động sản trên toàn quốc — căn hộ, phòng trọ, nhà nguyên căn, văn phòng.',
};

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  );
}
