import type { Metadata } from 'next';
import { Phone, Mail, MapPin, Globe2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/seo';
import { ContactForm } from '@/components/forms/ContactForm';
import { COMPANY } from '@/lib/constants';
import { getSiteSettings } from '@/lib/server-data';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { contact } = await getSiteSettings();
  return {
    title: 'Liên hệ',
    description: `Liên hệ với đội ngũ ${contact.site_name} — hỗ trợ tin đăng, hợp tác, phản hồi.`,
  };
}

export default async function ContactPage() {
  const { contact } = await getSiteSettings();
  const INFO = [
    { Icon: Phone, label: 'Hotline', value: contact.hotline, accent: 'text-primary', bg: 'bg-primary/10' },
    { Icon: Mail, label: 'Email', value: contact.email, accent: 'text-price', bg: 'bg-price-soft' },
    {
      Icon: MapPin,
      label: 'Trụ sở',
      value: COMPANY.address,
      accent: 'text-vip',
      bg: 'bg-vip-soft',
    },
    {
      Icon: Globe2,
      label: 'Website',
      value: COMPANY.website ?? 'Chưa đăng ký',
      accent: 'text-ink',
      bg: 'bg-surface-subtle',
    },
  ];
  return (
    <div className="container-app py-8">
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Liên hệ' }]} />
      <header className="mt-4 mb-6">
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">Liên hệ với chúng tôi</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Mọi yêu cầu hỗ trợ, hợp tác hoặc góp ý xin vui lòng gửi qua kênh dưới đây.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-md border border-brdr bg-white p-6 shadow-raised">
          <h2 className="mb-4 text-lg font-semibold text-ink">Thông tin liên hệ</h2>
          <ul className="space-y-4">
            {INFO.map((it) => {
              const Icon = it.Icon;
              return (
                <li key={it.label} className="flex items-start gap-3">
                  <span
                    className={`icon-chip grid h-10 w-10 shrink-0 place-items-center rounded-md ${it.bg} ${it.accent}`}
                  >
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink-muted">{it.label}</p>
                    <p className="text-sm font-semibold text-ink">{it.value}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <ContactForm />
      </div>

      <section className="mt-10 rounded-md border border-brdr bg-white p-6 shadow-raised sm:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            Chủ sở hữu và vận hành website
          </p>
          <h2 className="mt-2 text-xl font-semibold text-ink sm:text-2xl">
            Thông tin doanh nghiệp
          </h2>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['Tên doanh nghiệp', COMPANY.legalName],
            ['Mã số doanh nghiệp (MST)', COMPANY.taxCode],
            ['Ngày đăng ký lần đầu', COMPANY.registrationDate],
            ['Người đại diện pháp luật', COMPANY.legalRepresentative],
            ['Chức vụ', COMPANY.representativeTitle],
            ['Vốn điều lệ', COMPANY.charterCapital],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs uppercase tracking-wide text-ink-muted">{label}</dt>
              <dd className="mt-1 text-sm font-semibold leading-relaxed text-ink">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 border-t border-brdr pt-6">
          <h3 className="text-lg font-semibold text-ink">Ngành nghề kinh doanh</h3>
          <div className="mt-3 rounded-md border border-primary/15 bg-primary/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Mã ngành chính: {COMPANY.primaryIndustryCode}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink">{COMPANY.primaryIndustry}</p>
          </div>
          <ul className="mt-4 grid list-disc grid-cols-1 gap-x-8 gap-y-2 pl-5 text-sm text-ink-muted sm:grid-cols-2 lg:grid-cols-3">
            {COMPANY.industries.map((industry) => (
              <li key={industry}>{industry}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
