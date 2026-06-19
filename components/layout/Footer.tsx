import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Youtube,
  MessageCircle,
  Smartphone,
  ArrowUp,
} from 'lucide-react';
import { COMPANY, SITE } from '@/lib/constants';
import { Logo } from './Logo';

interface FooterGroup {
  title: string;
  links: { label: string; href: string }[];
}

const COLUMNS: FooterGroup[] = [
  {
    title: 'Bán bất động sản',
    links: [
      { label: 'Bán căn hộ chung cư', href: '/ban-can-ho' },
      { label: 'Bán nhà riêng', href: '/ban-nha-rieng' },
      { label: 'Bán đất', href: '/ban-dat' },
      { label: 'Bán nhà mặt phố', href: '/ban-nha-mat-pho' },
      { label: 'Bán biệt thự', href: '/ban-biet-thu' },
    ],
  },
  {
    title: 'Cho thuê bất động sản',
    links: [
      { label: 'Cho thuê căn hộ', href: '/cho-thue-can-ho' },
      { label: 'Cho thuê phòng trọ', href: '/cho-thue-phong-tro' },
      { label: 'Cho thuê nhà nguyên căn', href: '/cho-thue-nha-nguyen-can' },
      { label: 'Cho thuê văn phòng', href: '/cho-thue-van-phong' },
      { label: 'Cho thuê mặt bằng', href: '/cho-thue-mat-bang' },
      { label: 'Ở ghép', href: '/o-ghep' },
    ],
  },
  {
    title: 'Khám phá Việt Nam',
    links: [
      { label: 'BĐS TP.HCM', href: '/tin-dang?cityCode=hcm' },
      { label: 'BĐS Hà Nội', href: '/tin-dang?cityCode=hn' },
      { label: 'BĐS Đà Nẵng', href: '/tin-dang?cityCode=dnang' },
      { label: 'BĐS Bình Dương', href: '/tin-dang?cityCode=bd' },
      { label: 'BĐS Đồng Nai', href: '/tin-dang?cityCode=dn' },
      { label: 'Tin tức BĐS', href: '/blog' },
    ],
  },
  {
    title: 'Khu vực hot',
    links: [
      { label: 'Quận 1, TP.HCM', href: '/tin-dang?cityCode=hcm&districtCode=q1' },
      { label: 'Quận 7, TP.HCM', href: '/tin-dang?cityCode=hcm&districtCode=q7' },
      { label: 'Bình Thạnh, TP.HCM', href: '/tin-dang?cityCode=hcm&districtCode=qbt' },
      { label: 'Thủ Đức, TP.HCM', href: '/tin-dang?cityCode=hcm&districtCode=qtd' },
      { label: 'Cầu Giấy, Hà Nội', href: '/tin-dang?cityCode=hn&districtCode=cg' },
      { label: 'Tây Hồ, Hà Nội', href: '/tin-dang?cityCode=hn&districtCode=th' },
    ],
  },
  {
    title: 'Cho người đăng tin',
    links: [
      { label: 'Đăng tin', href: '/tai-khoan/dang-tin' },
      { label: 'Đăng ký tài khoản', href: '/dang-ky' },
      { label: 'Gói môi giới', href: '/goi-moi-gioi' },
      { label: 'Xác thực eKYC', href: '/quy-che' },
      { label: 'Hợp tác đại lý', href: '/lien-he' },
    ],
  },
  {
    title: 'Công cụ & tiện ích',
    links: [
      { label: 'Tính lãi vay mua nhà', href: '/tien-ich/tinh-lai-suat' },
      { label: 'Chi phí làm nhà', href: '/tien-ich/chi-phi-xay-nha' },
      { label: 'Xem tuổi xây nhà', href: '/tien-ich/tuoi-xay-nha' },
      { label: 'Tư vấn phong thuỷ', href: '/tien-ich/phong-thuy' },
      { label: 'Bản đồ quy hoạch', href: '/tien-ich/quy-hoach' },
      { label: 'So sánh tin đăng', href: '/so-sanh' },
    ],
  },
  {
    title: 'Công ty',
    links: [
      { label: 'Về BDS Việt', href: '/lien-he' },
      { label: 'Blog & Cẩm nang', href: '/blog' },
      { label: 'Liên hệ', href: '/lien-he' },
      { label: 'Quy chế hoạt động', href: '/quy-che' },
      { label: 'Chính sách bảo mật', href: '/bao-mat' },
    ],
  },
  {
    title: 'Khám phá thêm',
    links: [
      { label: 'Tính khả năng vay', href: '/tien-ich/tinh-lai-suat' },
      { label: 'Nên mua hay thuê?', href: '/blog' },
      { label: 'Lợi tức cho thuê', href: '/blog' },
      { label: 'Quảng cáo trên BDS Việt', href: '/goi-moi-gioi' },
      { label: 'Trung tâm trợ giúp', href: '/lien-he' },
    ],
  },
];

const SOCIAL = [
  { Icon: Facebook, href: 'https://facebook.com/', label: 'Facebook' },
  { Icon: Youtube, href: 'https://youtube.com/', label: 'YouTube' },
  { Icon: MessageCircle, href: 'https://zalo.me/', label: 'Zalo' },
];

export function Footer() {
  return (
    <footer className="mt-12 bg-ink-strong text-white/90">
      {/* Brand strip */}
      <div className="border-b border-white/10">
        <div className="container-app grid grid-cols-1 gap-8 py-10 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="text-white">
              <Logo />
            </div>
            <p className="mt-3 max-w-md text-sm text-white/70">
              Nền tảng tin đăng bất động sản hàng đầu — kết nối hàng nghìn chủ nhà và người mua thuê
              trên toàn quốc với tin được xác thực, công cụ tìm kiếm thông minh và dữ liệu thị trường minh bạch.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {SOCIAL.map((s) => {
                const Icon = s.Icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="unstyled grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white hover:bg-white/15"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Liên hệ
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="inline-flex items-start gap-2">
                <Phone size={14} className="mt-1 shrink-0 text-white/60" />
                <a
                  href={`tel:${SITE.contactPhone.replace(/\s/g, '')}`}
                  className="unstyled text-white hover:underline"
                >
                  Hotline: {SITE.contactPhone}
                </a>
              </li>
              <li className="inline-flex items-start gap-2">
                <Mail size={14} className="mt-1 shrink-0 text-white/60" />
                <a
                  href={`mailto:${SITE.contactEmail}`}
                  className="unstyled text-white hover:underline"
                >
                  {SITE.contactEmail}
                </a>
              </li>
              <li className="inline-flex items-start gap-2">
                <MapPin size={14} className="mt-1 shrink-0 text-white/60" />
                <span className="text-white/80">{COMPANY.address}</span>
              </li>
            </ul>
            <div className="mt-3 space-y-1 text-xs leading-relaxed text-white/55">
              <p className="font-semibold text-white/75">{COMPANY.legalName}</p>
              <p>Mã số doanh nghiệp: {COMPANY.taxCode}</p>
              <p>
                Người đại diện: {COMPANY.legalRepresentative} — {COMPANY.representativeTitle}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Tải ứng dụng
            </h4>
            <p className="mt-3 text-sm text-white/70">
              Đăng tin và quản lý BĐS mọi lúc trên di động.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="#"
                className="unstyled inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs text-white hover:bg-white/15"
              >
                <Smartphone size={16} />
                <span>
                  <span className="block text-[10px] text-white/60">Tải về trên</span>
                  <span className="block font-semibold">App Store</span>
                </span>
              </a>
              <a
                href="#"
                className="unstyled inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs text-white hover:bg-white/15"
              >
                <Smartphone size={16} />
                <span>
                  <span className="block text-[10px] text-white/60">Có trên</span>
                  <span className="block font-semibold">Google Play</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="container-app py-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold text-white">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="unstyled text-xs text-white/65 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-white/10 bg-black/30">
        <div className="container-app flex flex-col items-start gap-3 py-5 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 <span className="font-semibold text-white">{SITE.name}</span>. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <span aria-hidden>🇻🇳</span> Tiếng Việt
            </span>
            <a href="#top" className="unstyled inline-flex items-center gap-1 text-white/80 hover:text-white">
              Lên đầu trang <ArrowUp size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
