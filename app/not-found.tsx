import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-app grid min-h-[60vh] place-items-center py-12 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink sm:text-4xl">Không tìm thấy trang</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Trang bạn tìm có thể đã bị xoá hoặc đường dẫn không chính xác.
        </p>
        <Link
          href="/"
          className="unstyled mt-6 inline-flex items-center rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
