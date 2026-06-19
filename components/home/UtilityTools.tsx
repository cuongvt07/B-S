import Link from 'next/link';
import Image from 'next/image';

const TOOLS = [
  {
    label: 'Xem tuổi xây nhà',
    desc: 'Tra cứu năm hợp tuổi làm nhà',
    href: '/tien-ich/tuoi-xay-nha',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=480&q=80',
  },
  {
    label: 'Chi phí làm nhà',
    desc: 'Ước tính chi phí xây dựng',
    href: '/tien-ich/chi-phi-xay-nha',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=480&q=80',
  },
  {
    label: 'Tính lãi suất',
    desc: 'Tính khoản vay ngân hàng',
    href: '/tien-ich/tinh-lai-suat',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=480&q=80',
  },
  {
    label: 'Tư vấn phong thuỷ',
    desc: 'Hướng nhà, bố trí nội thất',
    href: '/tien-ich/phong-thuy',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=480&q=80',
  },
  {
    label: 'Bản đồ quy hoạch',
    desc: 'Tra cứu quy hoạch khu vực',
    href: '/tien-ich/quy-hoach',
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=480&q=80',
  },
  {
    label: 'Wiki bất động sản',
    desc: 'Thuật ngữ và kiến thức BĐS',
    href: '/wiki',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=480&q=80',
  },
];

export function UtilityTools() {
  return (
    <section className="container-app py-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-ink sm:text-2xl">Hỗ trợ tiện ích</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Công cụ miễn phí giúp bạn ra quyết định nhanh và đúng
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {TOOLS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="classic-tool unstyled group flex flex-col items-start overflow-hidden rounded-md border border-[#ded8cd] bg-[#fffdf9] shadow-raised"
            >
              <span className="classic-tool__image">
                <Image src={t.image} alt={t.label} fill sizes="(max-width: 640px) 50vw, 16vw" className="object-cover" />
              </span>
              <span className="block p-4">
                <span className="block text-sm font-semibold text-ink transition-colors group-hover:text-[#9a6a32]">{t.label}</span>
                <span className="mt-1 block text-xs text-ink-muted">{t.desc}</span>
              </span>
            </Link>
        ))}
      </div>
    </section>
  );
}
