import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PlusCircle, FileText } from 'lucide-react';
import { Button, Card, EmptyState } from '@/components/ui';
import { MyListingRow } from '@/components/dashboard';
import { SESSION_COOKIE_NAME, userFromToken } from '@/mocks/session';
import { listingsStore } from '@/mocks/store';

export default async function MyListingsPage() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const user = userFromToken(token);
  if (!user) redirect('/dang-nhap?next=/tai-khoan/tin-cua-toi');

  const myListings = listingsStore.ofOwner(user.id);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Tin của tôi</h1>
          <p className="mt-1 text-sm text-ink-muted">{myListings.length} tin đăng</p>
        </div>
        <Link href="/tai-khoan/dang-tin" className="unstyled">
          <Button leftIcon={<PlusCircle size={16} />}>Đăng tin mới</Button>
        </Link>
      </header>

      {myListings.length === 0 ? (
        <Card padded className="!p-0">
          <EmptyState
            icon={FileText}
            title="Bạn chưa có tin đăng nào"
            description="Tạo tin đăng đầu tiên để bắt đầu nhận liên hệ từ khách hàng."
            action={
              <Link href="/tai-khoan/dang-tin" className="unstyled">
                <Button leftIcon={<PlusCircle size={16} />}>Đăng tin đầu tiên</Button>
              </Link>
            }
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {myListings.map((l) => (
            <MyListingRow key={l.id} listing={l} />
          ))}
        </div>
      )}
    </div>
  );
}
