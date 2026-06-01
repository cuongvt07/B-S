'use client';

import type { ReactNode } from 'react';
import { Phone, MessageCircle, Facebook } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ListingContact } from '@/types';

export type ContactSize = 'sm' | 'md' | 'lg';

interface BtnProps {
  href: string;
  title: string;
  variant: 'phone' | 'zalo' | 'messenger';
  size: ContactSize;
  children: ReactNode;
  external?: boolean;
  fullWidth?: boolean;
  label?: string;
}

const variantClass: Record<BtnProps['variant'], string> = {
  phone: 'text-price hover:bg-price-soft border-price/20 hover:border-price/40',
  zalo: 'text-[#0068FF] hover:bg-[#E6F2FF] border-[#0068FF]/20 hover:border-[#0068FF]/50',
  messenger: 'text-[#0084FF] hover:bg-[#E6F2FF] border-[#0084FF]/20 hover:border-[#0084FF]/50',
};

const sizeShape: Record<ContactSize, { box: string; icon: number; gap: string; label: string }> = {
  sm: { box: 'h-8 w-8', icon: 14, gap: 'gap-1', label: 'hidden' },
  md: { box: 'h-9 w-9', icon: 16, gap: 'gap-1.5', label: 'hidden sm:inline text-xs' },
  lg: { box: 'h-11 px-4', icon: 16, gap: 'gap-2', label: 'inline text-sm font-semibold' },
};

function Btn({ href, title, variant, size, children, external, fullWidth, label }: BtnProps) {
  const s = sizeShape[size];
  const isPill = size === 'lg';
  return (
    <a
      href={href}
      title={title}
      aria-label={title}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'inline-flex items-center justify-center border bg-white font-semibold transition-all',
        'hover:-translate-y-0.5',
        isPill ? 'rounded-sm' : 'grid place-items-center rounded-full',
        s.box,
        s.gap,
        variantClass[variant],
        fullWidth && 'w-full'
      )}
    >
      {children}
      {label && <span className={s.label}>{label}</span>}
    </a>
  );
}

export interface ContactActionsProps {
  contact: ListingContact;
  size?: ContactSize;
  fullWidth?: boolean;
  showLabels?: boolean;
  className?: string;
}

export function ContactActions({
  contact,
  size = 'sm',
  fullWidth = false,
  showLabels = false,
  className,
}: ContactActionsProps) {
  const phoneDigits = contact.phone.replace(/\D/g, '');

  return (
    <div className={cn('flex items-center gap-1.5', fullWidth && 'grid grid-cols-3 gap-2', className)}>
      <Btn
        href={`tel:${phoneDigits}`}
        title={`Gọi ${contact.phone}`}
        variant="phone"
        size={size}
        fullWidth={fullWidth}
        label={showLabels ? 'Gọi' : undefined}
      >
        <Phone size={sizeShape[size].icon} />
      </Btn>
      {contact.zalo && (
        <Btn
          href={`https://zalo.me/${contact.zalo.replace(/\D/g, '')}`}
          title="Chat qua Zalo"
          variant="zalo"
          size={size}
          external
          fullWidth={fullWidth}
          label={showLabels ? 'Zalo' : undefined}
        >
          <MessageCircle size={sizeShape[size].icon} />
        </Btn>
      )}
      {contact.messengerId && (
        <Btn
          href={`https://m.me/${contact.messengerId}`}
          title="Chat qua Messenger"
          variant="messenger"
          size={size}
          external
          fullWidth={fullWidth}
          label={showLabels ? 'Messenger' : undefined}
        >
          <Facebook size={sizeShape[size].icon} />
        </Btn>
      )}
    </div>
  );
}
