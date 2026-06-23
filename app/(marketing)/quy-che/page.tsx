import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/seo';
import { COMPANY } from '@/lib/constants';
import { getSiteSettings } from '@/lib/server-data';

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { contact } = await getSiteSettings();
  return {
    title: 'Quy chế hoạt động',
    description: `Quy chế và điều khoản sử dụng nền tảng ${contact.site_name}.`,
  };
}

export default async function TermsPage() {
  const { contact } = await getSiteSettings();
  return (
    <div className="container-app mx-auto max-w-3xl py-8">
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Quy chế hoạt động' }]} />

      <h1 className="mt-4 text-3xl font-semibold text-ink">Quy chế hoạt động</h1>
      <p className="mb-6 mt-2 text-sm text-ink-muted">Cập nhật ngày 19/06/2026</p>

      <section>
        <h2 className="mb-3 mt-8 text-lg font-semibold text-ink">1. Quy định chung</h2>
        <p className="my-3 leading-relaxed text-ink">
          {contact.site_name} (sau đây gọi là &ldquo;Nền tảng&rdquo;) cung cấp dịch vụ tin đăng mua bán, cho thuê
          bất động sản trên toàn quốc. Bằng việc sử dụng dịch vụ, bạn đồng ý tuân thủ toàn bộ các
          điều khoản trong quy chế này.
        </p>
        <p className="my-3 leading-relaxed text-ink">
          Nền tảng do <strong>{COMPANY.legalName}</strong>, mã số doanh nghiệp{' '}
          <strong>{COMPANY.taxCode}</strong>, sở hữu và vận hành. Người đại diện theo pháp luật là{' '}
          <strong>{COMPANY.legalRepresentative}</strong>, chức vụ {COMPANY.representativeTitle}.
        </p>
        <p className="my-3 leading-relaxed text-ink">
          Quy chế có thể được điều chỉnh theo thời gian; phiên bản mới sẽ được công bố tại trang này
          và có hiệu lực ngay sau khi đăng tải.
        </p>
      </section>

      <section>
        <h2 className="mb-3 mt-8 text-lg font-semibold text-ink">2. Quyền và nghĩa vụ thành viên</h2>
        <p className="my-3 leading-relaxed text-ink">Thành viên có quyền:</p>
        <ul className="my-3 list-disc space-y-1 pl-6 text-ink">
          <li>Đăng tin BĐS theo các gói được cung cấp.</li>
          <li>Quản lý, chỉnh sửa, gia hạn hoặc xoá tin đăng của mình.</li>
          <li>Sử dụng các tiện ích miễn phí và trả phí trên nền tảng.</li>
          <li>Yêu cầu hỗ trợ kỹ thuật và phản hồi từ đội ngũ vận hành.</li>
        </ul>
        <p className="my-3 leading-relaxed text-ink">Thành viên có nghĩa vụ:</p>
        <ul className="my-3 list-disc space-y-1 pl-6 text-ink">
          <li>Cung cấp thông tin chính xác, không gây hiểu lầm.</li>
          <li>Không đăng nội dung vi phạm pháp luật Việt Nam hoặc thuần phong mỹ tục.</li>
          <li>Bảo mật tài khoản và mật khẩu cá nhân.</li>
          <li>Thanh toán đầy đủ các gói dịch vụ đã đăng ký.</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-3 mt-8 text-lg font-semibold text-ink">3. Quy định đăng tin BĐS</h2>
        <p className="my-3 leading-relaxed text-ink">
          Mỗi tin đăng phải mô tả đúng thực trạng bất động sản, kèm hình ảnh thực tế (không qua chỉnh
          sửa gây nhầm lẫn). Người đăng phải là chủ sở hữu hoặc được uỷ quyền hợp pháp.
        </p>
        <ul className="my-3 list-disc space-y-1 pl-6 text-ink">
          <li>Cấm trùng lặp nội dung, đăng nhiều tin cùng một bất động sản.</li>
          <li>Cấm sử dụng từ khoá spam, viết hoa toàn bộ, ký tự đặc biệt vô nghĩa.</li>
          <li>Cấm rao bán đa cấp, hứa lợi nhuận phi thực tế.</li>
          <li>Tin có thông tin liên hệ giả mạo sẽ bị xoá và khoá tài khoản.</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-3 mt-8 text-lg font-semibold text-ink">4. Tin VIP và gói nâng cấp</h2>
        <p className="my-3 leading-relaxed text-ink">
          Các gói VIP và gói môi giới cho phép đẩy top, làm nổi bật, banner trang chủ và nhiều ưu đãi
          khác. Mức phí và tính năng chi tiết xem tại trang Bảng giá. Phí đã thanh toán không hoàn lại
          trừ trường hợp hệ thống lỗi từ phía Nền tảng.
        </p>
      </section>

      <section>
        <h2 className="mb-3 mt-8 text-lg font-semibold text-ink">5. Xử lý vi phạm</h2>
        <p className="my-3 leading-relaxed text-ink">
          Tuỳ mức độ vi phạm, Nền tảng có quyền: cảnh báo, xoá tin đăng, khoá tài khoản tạm thời hoặc
          vĩnh viễn, từ chối hoàn phí. Trong trường hợp gây thiệt hại nghiêm trọng, Nền tảng có thể
          thông báo cho cơ quan chức năng.
        </p>
      </section>

      <section>
        <h2 className="mb-3 mt-8 text-lg font-semibold text-ink">6. Bảo mật và quyền riêng tư</h2>
        <p className="my-3 leading-relaxed text-ink">
          Nền tảng cam kết bảo vệ thông tin cá nhân của thành viên. Chi tiết được mô tả trong
          <em> Chính sách bảo mật</em>.
        </p>
      </section>

      <section>
        <h2 className="mb-3 mt-8 text-lg font-semibold text-ink">7. Hỗ trợ</h2>
        <p className="my-3 leading-relaxed text-ink">
          Mọi thắc mắc xin vui lòng gửi qua email <strong>{contact.email}</strong> hoặc gọi
          hotline <strong>{contact.hotline}</strong>. Địa chỉ liên hệ: {COMPANY.address}.
        </p>
      </section>
    </div>
  );
}
