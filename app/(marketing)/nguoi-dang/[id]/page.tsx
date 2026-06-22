import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Phone,
  Calendar,
  CheckCircle2,
  MapPin,
  Share2,
  UserPlus,
  Eye,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/seo';
import { Badge, Button } from '@/components/ui';
import { ListingCard, ContactActions, ReportButton } from '@/components/listing';
import { AuthGate } from '@/components/auth';
import { listListings } from '@/lib/server-data';
import { userById } from '@/mocks/data/users';
import { formatNumber } from '@/lib/utils/format';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface PageProps {
  params: { id: string };
}

function joinedSince(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { locale: vi });
  } catch {
    return '';
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const user = userById.get(params.id);
  if (!user) return { title: 'Người đăng' };
  return {
    title: `${user.name} — Tin đăng & thông tin`,
    description: `Xem tất cả tin đăng và thông tin liên hệ của ${user.name} trên BDS Việt.`,
  };
}

export default async function OwnerProfilePage({ params }: PageProps) {
  const user = userById.get(params.id);
  if (!user) notFound();

  const all = await listListings({ pageSize: 100 });
  const ownerListings = all.data.filter((l) => l.ownerId === user.id);
  const activeListings = ownerListings.filter((l) => l.status === 'active');
  const inactiveListings = ownerListings.filter((l) => l.status !== 'active');
  const totalViews = ownerListings.reduce((s, l) => s + l.viewCount, 0);

  // Use the first listing's contact as the canonical contact (all listings of this user share)
  const contact = ownerListings[0]?.contact ?? {
    name: user.name,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
  };

  return (
    <div className="container-app py-6">
      <Breadcrumbs
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Người đăng', href: '/' },
          { label: user.name },
        ]}
      />

      {/* Profile header */}
      <header className="mt-4 rounded-md border border-brdr bg-white p-6 shadow-raised">
        <div className="flex flex-wrap items-start gap-5">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-elevated">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt={user.name} fill sizes="96px" className="object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center bg-surface-subtle text-2xl font-semibold text-ink-muted">
                {user.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold text-ink">{user.name}</h1>
              {user.verifiedAt && (
                <Badge variant="success">
                  <CheckCircle2 size={12} />
                  Đã xác thực
                </Badge>
              )}
              {user.role === 'broker' && <Badge variant="vip">Môi giới</Badge>}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-price" />
                Hoạt động gần đây
              </span>
              <span>·</span>
              <span>Tỷ lệ phản hồi: <strong className="text-ink">92%</strong></span>
              <span>·</span>
              <span>Người theo dõi: <strong className="text-ink">2</strong></span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-1">
                <Calendar size={12} /> Tham gia {joinedSince(user.createdAt)}
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={12} /> Chưa cung cấp
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <Phone size={12} /> {user.phone.replace(/\d{3}(?=\d{3}$)/, '***')}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <AuthGate
                title="Đăng nhập để liên hệ"
                description="Đăng nhập để xem số điện thoại đầy đủ và liên hệ Zalo / Messenger."
                blur="sm"
              >
                <ContactActions contact={contact} size="md" showLabels />
              </AuthGate>
              <Button variant="outline" size="sm" leftIcon={<Share2 size={14} />}>
                Chia sẻ
              </Button>
              <Button variant="outline" size="sm" leftIcon={<UserPlus size={14} />}>
                Theo dõi
              </Button>
              <ReportButton
                targetType="user"
                reportedUserId={Number.isFinite(Number(user.id)) ? Number(user.id) : undefined}
                variant="button"
                label="Báo cáo"
              />
            </div>
          </div>

          {/* Right stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            <div className="text-center">
              <p className="text-2xl font-semibold text-ink">{ownerListings.length}</p>
              <p className="text-xs text-ink-muted">Tin đăng</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-ink">{formatNumber(totalViews)}</p>
              <p className="text-xs text-ink-muted">Lượt xem</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold text-ink">92%</p>
              <p className="text-xs text-ink-muted">Phản hồi</p>
            </div>
          </div>
        </div>
      </header>

      {/* Listings */}
      <section className="mt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-ink">
            Tất cả tin đăng ({ownerListings.length})
          </h2>
          <p className="inline-flex items-center gap-1 text-xs text-ink-muted">
            <Eye size={12} /> {formatNumber(totalViews)} lượt xem
          </p>
        </div>

        <div className="mb-4 inline-flex rounded-full border border-brdr bg-surface-subtle p-1">
          <span className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-ink shadow-raised">
            Tin đang hoạt động ({activeListings.length})
          </span>
          <span className="px-4 py-1.5 text-sm text-ink-muted">
            Hết hạn ({inactiveListings.length})
          </span>
        </div>

        {activeListings.length === 0 ? (
          <div className="rounded-md border border-dashed border-brdr bg-white p-8 text-center text-ink-muted">
            Hiện chưa có tin đăng nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeListings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
