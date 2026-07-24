'use client';

import type { ReactNode } from 'react';
import { Phone, MessageCircle, Facebook } from '@/components/icons';
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
  phone: 'text-price hover:bg-price-soft border-price/30 hover:border-price/60',
  zalo: 'text-[#0068FF] hover:bg-[#E6F2FF] border-[#0068FF]/30 hover:border-[#0068FF]/60',
  messenger:
    'text-[#0084FF] hover:bg-[#E6F2FF] border-[#0084FF]/30 hover:border-[#0084FF]/60',
};

const sizeShape: Record<ContactSize, { box: string; iconBox: string; icon: number; label: string }> = {
  sm: {
    box: 'h-8 w-8 rounded-full',
    iconBox: 'h-8 w-8 rounded-full',
    icon: 14,
    label: 'hidden',
  },
  md: {
    // pill with auto-width when label shown — h-11 để khớp chiều cao <Button> md
    // (nút "Xem chi tiết") khi đứng cạnh nhau trong popup/panel.
    box: 'h-11 px-4 rounded-full text-sm gap-2',
    iconBox: 'h-11 w-11 rounded-full',
    icon: 16,
    label: 'inline font-semibold',
  },
  lg: {
    box: 'h-11 px-4 rounded-sm text-sm gap-2',
    iconBox: 'h-11 w-11 rounded-sm',
    icon: 16,
    label: 'inline font-semibold',
  },
};

function Btn({ href, title, variant, size, children, external, fullWidth, label }: BtnProps) {
  const s = sizeShape[size];
  const iconOnly = size === 'sm' || !label;
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
        'hover:-translate-y-0.5 hover:shadow-raised',
        iconOnly ? s.iconBox : s.box,
        variantClass[variant],
        fullWidth && 'w-full'
      )}
    >
      {children}
      {!iconOnly && label && <span>{label}</span>}
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
  const count = 1 + (contact.zalo ? 1 : 0) + (contact.messengerId ? 1 : 0);

  return (
    <div
      className={cn('items-center gap-2', fullWidth ? 'grid' : 'inline-flex flex-wrap', className)}
      style={fullWidth ? { gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` } : undefined}
    >
      <Btn
        href={`tel:${phoneDigits}`}
        title={`Gọi ${contact.phone}`}
        variant="phone"
        size={size}
        fullWidth={fullWidth}
        label={showLabels ? 'Gọi điện' : undefined}
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
