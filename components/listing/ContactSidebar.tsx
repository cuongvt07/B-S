'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui';
import { AuthGate } from '@/components/auth';
import type { Listing } from '@/types';
import { ContactActions } from './ContactActions';
import { formatNumber } from '@/lib/utils/format';

export function ContactSidebar({ listing }: { listing: Listing }) {
  const [reveal, setReveal] = useState(false);
  const c = listing.contact;
  const masked = c.phone.replace(/\d{3}$/, '***');

  return (
    <aside className="rounded-md border border-brdr bg-white p-4 shadow-raised">
      <div className="flex items-center gap-3 border-b border-brdr pb-3">
        {c.avatarUrl ? (
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-brdr">
            <Image src={c.avatarUrl} alt={c.name} fill sizes="48px" className="object-cover" />
          </div>
        ) : (
          <div className="grid h-12 w-12 place-items-center rounded-full bg-surface-subtle text-base font-semibold text-ink-muted">
            {c.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="line-clamp-1 text-sm font-semibold text-ink">{c.name}</p>
          <p className="text-xs text-ink-muted">{formatNumber(listing.viewCount)}+ lượt xem</p>
        </div>
      </div>

      <AuthGate
        title="Đăng nhập để xem liên hệ"
        description="Sau khi đăng nhập, bạn sẽ thấy số điện thoại, Zalo và Messenger của chủ tin."
      >
        <div className="mt-3 space-y-2">
          <Button
            variant="primary"
            fullWidth
            leftIcon={<Phone size={16} />}
            onClick={() => setReveal(true)}
          >
            {reveal ? c.phone : `${masked} · Bấm để xem`}
          </Button>

          <ContactActions contact={c} size="lg" fullWidth showLabels />

          <a
            href={`mailto:?subject=${encodeURIComponent('Quan tâm tin đăng: ' + listing.title)}`}
            className="unstyled inline-flex w-full items-center justify-center gap-2 rounded-sm border border-brdr px-4 py-3 text-sm font-semibold text-ink hover:border-primary hover:text-primary"
          >
            <Mail size={16} /> Gửi email yêu cầu
          </a>
        </div>
      </AuthGate>

      <p className="mt-3 text-xs text-ink-muted">
        Hãy nói với chủ tin rằng bạn thấy tin trên BDS Việt.
      </p>
    </aside>
  );
}
