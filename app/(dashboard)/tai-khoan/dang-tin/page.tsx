import { PostListingForm } from '@/components/dashboard';

export default function PostListingPage({
  searchParams,
}: {
  searchParams?: { edit?: string };
}) {
  const editId = searchParams?.edit;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink">
          {editId ? 'Cập nhật tin đăng' : 'Đăng tin mới'}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {editId
            ? 'Kiểm tra lại nội dung, hình ảnh và thông tin liên hệ trước khi cập nhật.'
            : 'Điền đầy đủ thông tin để tin đăng của bạn nhận được nhiều liên hệ hơn.'}
        </p>
      </header>
      <PostListingForm editId={editId} />
    </div>
  );
}
