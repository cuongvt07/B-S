'use client';

import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { MessageCircle, Phone, Send, Lock } from '@/components/icons';
import type { Listing } from '@/types';
import { AuthGate } from '@/components/auth/AuthGate';
import { Button, Input } from '@/components/ui';
import { leadApi } from '@/lib/api/leads';
import { ReportButton } from './ReportButton';
import { formatPrice, maskPhone } from '@/lib/utils/format';

export function ContactSidebar({ listing }: { listing: Listing }) {
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

  const contact = listing.contact;
  const maskedPhone = maskPhone(contact.phone);

  return (
    <aside className="space-y-4 rounded-md border border-brdr bg-white p-4 shadow-raised">
      {/* Thông tin người đăng */}
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-muted">Liên hệ người đăng</p>
        <p className="mt-1 font-semibold text-ink">{contact.name}</p>
      </div>

      {/* Nút gọi / Zalo */}
      <div className="flex gap-2">
        <a
          href={`tel:${contact.phone}`}
          className="unstyled flex flex-1 items-center justify-center gap-2 rounded-sm border border-brdr bg-white py-2.5 text-sm font-semibold text-ink transition hover:border-primary hover:text-primary"
        >
          <Phone size={16} /> {maskedPhone}
        </a>
        {contact.zalo && (
          <a
            href={`https://zalo.me/${contact.zalo.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="unstyled flex flex-1 items-center justify-center gap-2 rounded-sm py-2.5 text-sm font-semibold text-white transition"
            style={{ background: '#0068ff' }}
          >
            <MessageCircle size={16} /> Zalo
          </a>
        )}
      </div>

      {/* Form gửi yêu cầu */}
      <form onSubmit={submitLead} className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Gửi yêu cầu tư vấn</p>
        <Input
          label="Họ tên"
          type="text"
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
          className="h-11 w-full"
          loading={lead.isPending}
          leftIcon={<Send size={16} className="shrink-0" />}
        >
          Gửi yêu cầu
        </Button>
      </form>

      {/* Báo cáo */}
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
