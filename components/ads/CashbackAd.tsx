'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

const WIDGET_SRC = 'https://sancashback.shop/widget.js';
const DEALS_URL = 'https://sancashback.shop/deals';

interface CashbackAdProps {
  /** Xác suất hiển thị (0–1), quay ngẫu nhiên mỗi lần vào trang. */
  chance?: number;
  /** Số deal widget hiển thị (1–12). */
  limit?: number;
  className?: string;
}

/**
 * Khối "Deal Shopee hoàn tiền" của Săn Cashback. Gắn đúng embed code gốc
 * (thẻ <a> + script widget) nhưng chèn script ngay sau thẻ <a> của từng khối,
 * để widget vẫn render khi khối được thêm vào sau điều hướng client-side.
 */
export function CashbackAd({ chance = 1, limit = 4, className }: CashbackAdProps) {
  // Quay ngẫu nhiên phía client để không lệch hydration với HTML từ server.
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(Math.random() < chance);
  }, [chance]);

  useEffect(() => {
    const el = ref.current;
    if (!visible || !el) return;
    const script = document.createElement('script');
    script.src = WIDGET_SRC;
    script.async = true;
    script.dataset.type = 'deals';
    script.dataset.limit = String(limit);
    script.dataset.theme = 'light';
    script.dataset.rel = 'sponsored';
    // Widget đọc thẻ <a> ngay trước script làm link chân khối.
    el.appendChild(script);
    return () => script.remove();
  }, [visible, limit]);

  if (!visible) return null;

  // Widget tự vẽ khung + margin inline 16px; bỏ margin đó để vị trí do trang quyết định.
  return (
    <aside className={cn('my-4 [&_.sancashback-widget-host]:!m-0', className)}>
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
        Tài trợ
      </span>
      <div ref={ref}>
        <a href={DEALS_URL} className="sancashback-widget" target="_blank" rel="sponsored noopener noreferrer">
          Deal Shopee hoàn tiền – Săn Cashback
        </a>
      </div>
    </aside>
  );
}

interface InlineCashbackAdProps {
  children: React.ReactNode;
  chance?: number;
  /** Đoạn văn ngắn hơn số ký tự này không được chọn làm điểm chèn. */
  minParagraphLength?: number;
  className?: string;
}

/**
 * Bọc một khối nội dung (mô tả, bài viết...) và chèn quảng cáo vào sau một
 * đoạn <p> ngẫu nhiên bên trong. Không có đoạn phù hợp thì đặt cuối khối.
 */
export function InlineCashbackAd({
  children,
  chance = 1,
  minParagraphLength = 40,
  className,
}: InlineCashbackAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || Math.random() >= chance) return;

    const paragraphs = Array.from(container.querySelectorAll('p')).filter(
      (p) => (p.textContent ?? '').trim().length >= minParagraphLength
    );
    // Bỏ đoạn cuối để quảng cáo nằm giữa nội dung chứ không dính đuôi.
    const candidates = paragraphs.length > 1 ? paragraphs.slice(0, -1) : paragraphs;
    const anchor = candidates[Math.floor(Math.random() * candidates.length)];

    const el = document.createElement('div');
    if (anchor) anchor.after(el);
    else container.appendChild(el);
    setHost(el);

    return () => {
      el.remove();
      setHost(null);
    };
  }, [chance, minParagraphLength]);

  return (
    <div ref={containerRef} className={className}>
      {children}
      {host && createPortal(<CashbackAd />, host)}
    </div>
  );
}
