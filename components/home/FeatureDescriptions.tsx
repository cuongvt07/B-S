import Link from 'next/link';
import { Building2, KeyRound, Video, BookOpen } from 'lucide-react';

const FEATURES = [
  {
    Icon: Building2,
    title: 'Bất động sản bán',
    href: '/mua-ban',
    text:
      'Tìm ngôi nhà mơ ước hoặc cơ hội đầu tư hấp dẫn qua lượng tin rao lớn — bao gồm bán nhà riêng, bán căn hộ chung cư, bán đất nền, biệt thự và nhà mặt tiền tại Việt Nam.',
  },
  {
    Icon: KeyRound,
    title: 'Bất động sản cho thuê',
    href: '/cho-thue',
    text:
      'Cập nhật thường xuyên và đầy đủ các loại hình cho thuê: phòng trọ, nhà nguyên căn, văn phòng, mặt bằng kinh doanh — giúp bạn nhanh chóng tìm được BĐS ưng ý.',
  },
  {
    Icon: Video,
    title: 'Đánh giá dự án',
    href: '/blog?tag=Phân%20tích',
    text:
      'Các video và bài đánh giá tổng quan dự án cung cấp góc nhìn khách quan, giúp bạn ra quyết định đúng đắn cho nơi an cư lý tưởng hoặc cơ hội đầu tư sinh lời.',
  },
  {
    Icon: BookOpen,
    title: 'Wiki BĐS',
    href: '/blog',
    text:
      'Ngoài cập nhật biến động thị trường, chúng tôi cung cấp kiến thức về mua bán, cho thuê, đầu tư, vay mua nhà, phong thuỷ, thiết kế và mọi thông tin cần thiết cho người mua nhà.',
  },
];

export function FeatureDescriptions() {
  return (
    <section className="border-t border-brdr bg-surface-subtle">
      <div className="container-app py-10">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-ink sm:text-2xl">
            Triệu lựa chọn nhà, một kênh tìm kiếm
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Báo chí và cộng đồng người dùng đánh giá cao chất lượng tin đăng tại BDS Việt
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => {
            const Icon = f.Icon;
            return (
              <div key={f.title} className="group text-center">
                <div
                  className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary transition-transform duration-500 group-hover:scale-110 motion-safe:animate-float"
                  style={{ animationDelay: `${i * 200}ms` }}
                >
                  <Icon size={28} />
                </div>
                <Link
                  href={f.href}
                  className="unstyled mb-2 inline-block text-base font-semibold text-ink hover:text-primary"
                >
                  {f.title}
                </Link>
                <p className="text-sm leading-relaxed text-ink-muted">{f.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
