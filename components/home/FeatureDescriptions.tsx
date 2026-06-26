import Link from 'next/link';
import Image from 'next/image';
import { getSiteSettings } from '@/lib/server-data';

const FEATURES = [
  {
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=640&q=80',
    title: 'Bất động sản bán',
    href: '/mua-ban',
    text:
      'Tìm ngôi nhà mơ ước hoặc cơ hội đầu tư hấp dẫn qua lượng tin rao lớn — bao gồm bán nhà riêng, bán căn hộ chung cư, bán đất nền, biệt thự và nhà mặt tiền tại Việt Nam.',
  },
  {
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=640&q=80',
    title: 'Bất động sản cho thuê',
    href: '/cho-thue',
    text:
      'Cập nhật thường xuyên và đầy đủ các loại hình cho thuê: phòng trọ, nhà nguyên căn, văn phòng, mặt bằng kinh doanh — giúp bạn nhanh chóng tìm được BĐS ưng ý.',
  },
  {
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=640&q=80',
    title: 'Đánh giá dự án',
    href: '/blog?tag=Phân%20tích',
    text:
      'Các video và bài đánh giá tổng quan dự án cung cấp góc nhìn khách quan, giúp bạn ra quyết định đúng đắn cho nơi an cư lý tưởng hoặc cơ hội đầu tư sinh lời.',
  },
  {
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=640&q=80',
    title: 'Wiki BĐS',
    href: '/blog',
    text:
      'Ngoài cập nhật biến động thị trường, chúng tôi cung cấp kiến thức về mua bán, cho thuê, đầu tư, vay mua nhà, phong thuỷ, thiết kế và mọi thông tin cần thiết cho người mua nhà.',
  },
];

export async function FeatureDescriptions() {
  const { contact } = await getSiteSettings();
  return (
    <section className="border-t border-brdr bg-surface-subtle">
      <div className="container-app py-10">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold uppercase text-ink sm:text-2xl">
            Triệu lựa chọn nhà, một kênh tìm kiếm
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Báo chí và cộng đồng người dùng đánh giá cao chất lượng tin đăng tại {contact.site_name}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
              <div key={f.title} className="classic-feature group text-center">
                <div className="classic-feature__image">
                  <Image
                    src={f.image}
                    alt={f.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <Link
                  href={f.href}
                  className="unstyled mb-2 inline-block text-base font-semibold text-ink transition-colors group-hover:text-[#9a6a32]"
                >
                  {f.title}
                </Link>
                <p className="text-sm leading-relaxed text-ink-muted">{f.text}</p>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}
