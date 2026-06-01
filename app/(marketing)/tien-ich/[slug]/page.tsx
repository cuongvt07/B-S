import type { Metadata } from 'next';
import Link from 'next/link';
import { Wrench } from 'lucide-react';
import { Breadcrumbs } from '@/components/seo';
import { Button } from '@/components/ui';

interface PageProps {
  params: { slug: string };
}

function humanize(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function generateMetadata({ params }: PageProps): Metadata {
  return {
    title: `Tiện ích: ${humanize(params.slug)}`,
    description: `Công cụ tiện ích ${humanize(params.slug)} trên BDS Việt.`,
  };
}

export default function UtilityPage({ params }: PageProps) {
  const title = humanize(params.slug);
  return (
    <div className="container-app py-16 text-center">
      <Breadcrumbs
        items={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Tiện ích', href: '/' },
          { label: title },
        ]}
      />
      <div className="mx-auto mt-8 max-w-xl">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary">
          <Wrench size={36} />
        </div>
        <h1 className="text-2xl font-semibold text-ink">Tính năng đang được phát triển</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">
          Công cụ <strong>{title}</strong> sẽ sớm có mặt trên BDS Việt. Chúng tôi đang hoàn thiện
          tính năng để mang lại trải nghiệm tốt nhất.
        </p>
        <Link href="/" className="unstyled mt-6 inline-block">
          <Button variant="outline">← Về trang chủ</Button>
        </Link>
      </div>
    </div>
  );
}
