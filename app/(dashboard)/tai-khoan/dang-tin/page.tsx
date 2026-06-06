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
          {editId ? 'Cap nhat tin dang' : 'Dang tin moi'}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {editId
            ? 'Kiem tra lai noi dung, hinh anh va thong tin lien he truoc khi cap nhat.'
            : 'Dien day du thong tin de tin dang cua ban nhan duoc nhieu lien he hon.'}
        </p>
      </header>
      <PostListingForm editId={editId} />
    </div>
  );
}
