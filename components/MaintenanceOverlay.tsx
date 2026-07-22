/**
 * TẠM THỜI — Lớp phủ báo bảo trì.
 *
 * Đè lên toàn bộ trang, chặn mọi thao tác. Bật bằng env MAINTENANCE_MODE=1
 * trên Vercel (đổi env phải redeploy).
 *
 * Gỡ bỏ: xoá file này + dòng import & khối render trong app/layout.tsx.
 */
import { SITE } from '@/lib/constants';

export function MaintenanceOverlay() {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="maintenance-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      {/* Khoá cuộn trang bên dưới mà không cần JS. */}
      <style>{`body{overflow:hidden!important}`}</style>

      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl sm:p-10">
        <div
          aria-hidden="true"
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-3xl"
        >
          🛠️
        </div>

        <h1 id="maintenance-title" className="text-xl font-bold text-cta sm:text-2xl">
          Server hiện đang bảo trì
        </h1>

        <p className="mt-3 text-base leading-relaxed text-gray-600">
          Vui lòng quay lại sau.
        </p>

        <div className="mt-8 border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500">Cần hỗ trợ gấp?</p>
          <a
            href={`tel:${SITE.contactPhone.replace(/\s/g, '')}`}
            className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Hotline: {SITE.contactPhone}
          </a>
        </div>
      </div>
    </div>
  );
}
