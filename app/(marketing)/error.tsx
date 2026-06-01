'use client';

import { Button } from '@/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-app py-12 text-center">
      <h2 className="text-xl font-semibold text-ink">Có lỗi xảy ra</h2>
      <p className="mt-2 text-sm text-ink-muted">
        {error.message || 'Vui lòng thử lại sau ít phút.'}
      </p>
      <div className="mt-6">
        <Button onClick={reset}>Thử lại</Button>
      </div>
    </div>
  );
}
