import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ShineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon bên phải nhãn. Truyền null để ẩn. Mặc định: mũi tên trong vòng tròn. */
  icon?: ReactNode | null;
}

/** Mũi tên-trong-vòng-tròn mặc định (giữ nguyên style Uiverse gốc). */
const DefaultIcon = (
  <svg fill="currentColor" viewBox="0 0 24 24" className="btn-shine__icon" aria-hidden="true">
    <path
      clipRule="evenodd"
      fillRule="evenodd"
      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
    />
  </svg>
);

/**
 * Nút CTA hiệu ứng "shine" (theo mẫu Uiverse), bảng màu vàng / trắng / đen.
 * Style nằm ở class `.btn-shine` trong globals.css.
 */
export const ShineButton = forwardRef<HTMLButtonElement, ShineButtonProps>(function ShineButton(
  { icon, className, children, type = 'button', ...props },
  ref
) {
  return (
    <button ref={ref} type={type} className={cn('btn-shine-skin btn-shine', className)} {...props}>
      {children}
      {icon === undefined ? DefaultIcon : icon}
    </button>
  );
});
