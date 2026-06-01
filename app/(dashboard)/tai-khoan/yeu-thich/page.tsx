import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Heart } from 'lucide-react';
import { SESSION_COOKIE_NAME, userFromToken } from '@/mocks/session';
import { favoritesStore, listingsStore } from '@/mocks/store';
import { ListingGrid } from '@/components/listing';
import { Button, Card, EmptyState } from '@/components/ui';

export default async function FavoritesPage() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const user = userFromToken(token);
  if (!user) redirect('/dang-nhap?next=/tai-khoan/yeu-thich');

  const ids = favoritesStore.list(user.id);
  const favorites = ids
    .map((id) => listingsStore.get(id))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink">Tin đã yêu thích</h1>
        <p className="mt-1 text-sm text-ink-muted">{favorites.length} tin đăng đã lưu</p>
      </header>
      {favorites.length === 0 ? (
        <Card padded className="!p-0">
          <EmptyState
            icon={Heart}
            title="Bạn chưa lưu tin nào"
            description="Bấm biểu tượng trái tim trên thẻ tin đăng để lưu lại và xem nhanh sau."
            action={
              <Link href="/tin-dang" className="unstyled">
                <Button>Khám phá tin đăng</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <ListingGrid listings={favorites} />
      )}
    </div>
  );
}
