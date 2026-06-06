'use client';

import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { MessageCircle, Phone, Send } from 'lucide-react';
import type { Listing } from '@/types';
import { AuthGate } from '@/components/auth/AuthGate';
import { Button, Input } from '@/components/ui';
import { leadApi } from '@/lib/api/leads';
import { formatPrice } from '@/lib/utils/format';

export function ContactSidebar({ listing }: { listing: Listing }) {
  const [revealed, setRevealed] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(`Toi quan tam tin: ${listing.title}`);
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
      setFeedback('Da gui yeu cau. Bo phan tu van se lien he lai som.');
      setName('');
      setPhone('');
      setMessage(`Toi quan tam tin: ${listing.title}`);
    },
    onError: (error) => {
      setFeedback(error instanceof Error ? error.message : 'Gui yeu cau that bai');
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
        <p className="text-xs uppercase tracking-wide text-ink-muted">Lien he nguoi dang</p>
        <p className="mt-1 text-lg font-semibold text-ink">
          {listing.contact.name || 'Moi gioi / chu nha'}
        </p>
        <p className="mt-1 text-sm font-semibold text-price">
          {formatPrice(listing.price, listing.priceUnit)}
        </p>
      </div>

      <AuthGate>
        <div className="space-y-2">
          <Button
            type="button"
            className="w-full"
            onClick={() => setRevealed(true)}
          >
            <Phone size={16} /> {revealed ? listing.contact.phone : 'Hien so dien thoai'}
          </Button>
          {listing.contact.zalo && (
            <a
              href={`https://zalo.me/${listing.contact.zalo}`}
              target="_blank"
              rel="noreferrer"
              className="unstyled inline-flex w-full items-center justify-center gap-2 rounded-sm border border-brdr px-4 py-2 text-sm font-semibold text-ink hover:border-primary hover:text-primary"
            >
              <MessageCircle size={16} /> Chat Zalo
            </a>
          )}
          <a
            href={`tel:${listing.contact.phone}`}
            className="unstyled inline-flex w-full items-center justify-center gap-2 rounded-sm border border-brdr px-4 py-2 text-sm font-semibold text-ink hover:border-primary hover:text-primary"
          >
            <Phone size={16} /> Goi ngay
          </a>
        </div>
      </AuthGate>

      <form onSubmit={submitLead} className="space-y-3 border-t border-brdr pt-4">
        <p className="text-sm font-semibold text-ink">Yeu cau tu van tin nay</p>
        <Input
          label="Ho ten"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          autoComplete="name"
        />
        <Input
          label="So dien thoai"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          pattern="0[0-9]{9,10}"
          autoComplete="tel"
        />
        <div>
          <label className="mb-1 block text-sm font-semibold text-ink">Noi dung</label>
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
        <Button type="submit" className="w-full" loading={lead.isPending}>
          <Send size={16} /> Gui yeu cau
        </Button>
      </form>
    </aside>
  );
}
