import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/seo';
import { COMPANY, SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description: 'Chính sách bảo mật thông tin người dùng của BDS Việt.',
};

export default function PrivacyPage() {
  return (
    <div className="container-app mx-auto max-w-3xl py-8">
      <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Chính sách bảo mật' }]} />

      <h1 className="mt-4 text-3xl font-semibold text-ink">Chính sách bảo mật</h1>
      <p className="mb-6 mt-2 text-sm text-ink-muted">Hiệu lực từ 01/01/2026</p>

      <section>
        <h2 className="mb-3 mt-8 text-lg font-semibold text-ink">1. Thu thập thông tin</h2>
        <p className="my-3 leading-relaxed text-ink">
          BDS Việt thu thập các thông tin sau khi bạn sử dụng nền tảng: thông tin tài khoản (email, số
          điện thoại, họ tên), thông tin tin đăng bạn đăng tải, lịch sử tìm kiếm và tương tác, dữ liệu
          thiết bị (loại trình duyệt, hệ điều hành, địa chỉ IP).
        </p>
      </section>

      <section>
        <h2 className="mb-3 mt-8 text-lg font-semibold text-ink">2. Sử dụng thông tin</h2>
        <ul className="my-3 list-disc space-y-1 pl-6 text-ink">
          <li>Vận hành và cải thiện nền tảng.</li>
          <li>Xác thực danh tính, ngăn chặn gian lận.</li>
          <li>Liên hệ về dịch vụ, thông báo hệ thống.</li>
          <li>Gợi ý cá nhân hoá tin đăng phù hợp với bạn.</li>
          <li>Phân tích thống kê và nghiên cứu thị trường.</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-3 mt-8 text-lg font-semibold text-ink">3. Chia sẻ với bên thứ ba</h2>
        <p className="my-3 leading-relaxed text-ink">
          Chúng tôi không bán hay cho thuê thông tin cá nhân của bạn. Thông tin chỉ được chia sẻ trong
          các trường hợp: bạn đồng ý rõ ràng, đối tác cung cấp dịch vụ hạ tầng (lưu trữ, thanh toán) có
          cam kết bảo mật tương đương, hoặc theo yêu cầu của cơ quan có thẩm quyền.
        </p>
      </section>

      <section>
        <h2 className="mb-3 mt-8 text-lg font-semibold text-ink">4. Bảo mật dữ liệu</h2>
        <p className="my-3 leading-relaxed text-ink">
          Dữ liệu được lưu trữ trên hạ tầng đám mây đạt chuẩn ISO 27001. Mọi giao tiếp giữa trình duyệt
          và máy chủ được mã hoá TLS 1.3. Mật khẩu được hash bằng bcrypt; nhân viên không thể đọc mật
          khẩu của người dùng.
        </p>
      </section>

      <section>
        <h2 className="mb-3 mt-8 text-lg font-semibold text-ink">5. Cookie & theo dõi</h2>
        <p className="my-3 leading-relaxed text-ink">
          Chúng tôi sử dụng cookie để duy trì phiên đăng nhập, ghi nhớ tuỳ chỉnh và đo lường hiệu suất.
          Bạn có thể tắt cookie trong trình duyệt; tuy nhiên một số tính năng có thể không hoạt động
          đầy đủ.
        </p>
      </section>

      <section>
        <h2 className="mb-3 mt-8 text-lg font-semibold text-ink">6. Quyền của người dùng</h2>
        <ul className="my-3 list-disc space-y-1 pl-6 text-ink">
          <li>Quyền truy cập và yêu cầu sao chép dữ liệu cá nhân.</li>
          <li>Quyền chỉnh sửa thông tin sai lệch.</li>
          <li>Quyền yêu cầu xoá tài khoản và dữ liệu liên quan.</li>
          <li>Quyền rút lại đồng ý xử lý dữ liệu bất cứ lúc nào.</li>
        </ul>
      </section>

      <section>
        <h2 className="mb-3 mt-8 text-lg font-semibold text-ink">7. Liên hệ về bảo mật</h2>
        <p className="my-3 leading-relaxed text-ink">
          Mọi yêu cầu liên quan đến quyền riêng tư hoặc bảo mật xin vui lòng gửi email tới{' '}
          <strong>{SITE.contactEmail}</strong>. Đơn vị tiếp nhận và xử lý yêu cầu là{' '}
          <strong>{COMPANY.legalName}</strong>, mã số doanh nghiệp {COMPANY.taxCode}. Chúng tôi sẽ
          phản hồi trong vòng 7 ngày làm việc.
        </p>
      </section>
    </div>
  );
}
