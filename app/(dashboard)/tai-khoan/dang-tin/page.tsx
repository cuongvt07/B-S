import { PostListingForm } from '@/components/dashboard';

export default function PostListingPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink">Đăng tin mới</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Điền đầy đủ thông tin để tin đăng của bạn nhận được nhiều liên hệ hơn.
        </p>
      </header>
      <PostListingForm />
    </div>
  );
}
