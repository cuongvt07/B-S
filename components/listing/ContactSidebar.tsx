'use client';

import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { MessageCircle, Phone, Send } from 'lucide-react';
import type { Listing } from '@/types';
import { AuthGate } from '@/components/auth/AuthGate';
import { Button, Input } from '@/components/ui';
import { leadApi } from '@/lib/api/leads';
import { ReportButton } from './ReportButton';
import { formatPrice } from '@/lib/utils/format';

export function ContactSidebar({ listing }: { listing: Listing }) {
  const [revealed, setRevealed] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(`Tôi quan tâm tin: ${listing.title}`);
  const [feedback, setFeedback] = useState<string | null>(null);

  const lead = useMutation({
    mutationFn: () =>
      leadApi.submit({
        name,
        phone,
        message,
        listing_id: Number.isFinite(Number(listing.id)) ? Number(listing.id) : undefined,
      }),
    onSuccess: () => {
      setFeedback('Đã gửi yêu cầu. Bộ phận tư vấn sẽ liên hệ lại sớm.');
      setName('');
      setPhone('');
      setMessage(`Tôi quan tâm tin: ${listing.title}`);
    },
    onError: (error) => {
      setFeedback(error instanceof Error ? error.message : 'Gửi yêu cầu thất bại');
    },
  });

  function submitLead(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedback(null);
    lead.mutate();
  }

  return (
    <aside className="space-y-4 rounded-md border border-brdr bg-white p-4 shadow-raised">
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-muted">Liên hệ người đăng</p>
        <p className="mt-1 text-lg font-semibold text-ink">
          {listing.contact.name || 'Môi giới / chủ nhà'}
        </p>
        <p className="mt-1 text-sm font-semibold text-price">
          {formatPrice(listing.price, listing.priceUnit)}
        </p>
      </div>

      <AuthGate>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            <Phone size={18} className="shrink-0" />
            <span className="truncate">
              {revealed ? listing.contact.phone : 'Hiện số điện thoại'}
            </span>
          </button>
          {listing.contact.zalo && (
            <a
              href={`https://zalo.me/${listing.contact.zalo.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="unstyled flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-gold px-4 text-sm font-semibold text-gold-ink transition-colors hover:bg-gold-hover"
            >
              <MessageCircle size={18} className="shrink-0" /> Chat Zalo
            </a>
          )}
          <a
            href={`tel:${listing.contact.phone.replace(/\s/g, '')}`}
            className="unstyled flex h-11 w-full items-center justify-center gap-2 rounded-sm border border-brand/40 px-4 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
          >
            <Phone size={18} className="shrink-0" /> Gọi ngay
          </a>
        </div>
      </AuthGate>

      <form onSubmit={submitLead} className="space-y-3 border-t border-brdr pt-4">
        <p className="text-sm font-semibold text-ink">Yêu cầu tư vấn tin này</p>
        <Input
          label="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          autoComplete="name"
        />
        <Input
          label="Số điện thoại"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          pattern="0[0-9]{9,10}"
          autoComplete="tel"
        />
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Nội dung</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-sm border border-brdr px-3 py-2 text-sm focus:outline-none focus:border-primary"
            required
          />
        </div>
        {feedback && (
          <p className="rounded-sm bg-surface-subtle px-3 py-2 text-xs text-ink-muted">{feedback}</p>
        )}
        <Button
          type="submit"
          className="h-11 w-full !bg-brand hover:!bg-brand-hover active:!bg-brand-active"
          loading={lead.isPending}
        >
          <Send size={16} className="shrink-0" /> Gửi yêu cầu
        </Button>
      </form>

      <div className="flex justify-center border-t border-brdr pt-3">
        <ReportButton
          targetType="listing"
          listingId={Number.isFinite(Number(listing.id)) ? Number(listing.id) : undefined}
          label="Báo cáo tin này"
        />
      </div>
    </aside>
  );
}
