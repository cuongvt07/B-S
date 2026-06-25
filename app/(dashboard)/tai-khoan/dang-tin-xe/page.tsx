import { PostVehicleForm } from '@/components/dashboard';

export default function PostVehiclePage({
  searchParams,
}: {
  searchParams?: { edit?: string };
}) {
  const editId = searchParams?.edit;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink">{editId ? 'Cập nhật tin xe' : 'Đăng tin xe'}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {editId
            ? 'Kiểm tra lại thông tin, hình ảnh và liên hệ trước khi cập nhật.'
            : 'Điền thông tin xe (ô tô / xe máy) để tin đăng nhận được nhiều liên hệ hơn.'}
        </p>
      </header>
      <PostVehicleForm editId={editId} />
    </div>
  );
}
