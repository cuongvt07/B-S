'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Ô nhập OTP 6 số dùng chung cho MỌI luồng cần xác thực SMS trong Vault
 * (verify_phone, set_pin, withdrawal, change_phone_old/new). Chỉ lo phần
 * UI nhập liệu + đếm ngược gửi lại — logic gọi API request/verify do nơi
 * gọi (page) tự quyết định theo purpose của mình.
 */
export function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const digits = value.padEnd(6, ' ').split('').slice(0, 6);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        inputMode="numeric"
        autoFocus
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
        className="absolute inset-0 h-full w-full cursor-text opacity-0"
      />
      <div className="flex justify-between gap-2" onClick={() => inputRef.current?.focus()}>
        {digits.map((d, i) => (
          <span
            key={i}
            className={`flex h-12 flex-1 items-center justify-center rounded-xl border-2 text-lg font-bold text-[#0B1220] ${
              d !== ' ' ? 'border-vaultgreen bg-vaultgreen-soft' : 'border-[#EAECF0] bg-white'
            }`}
          >
            {d !== ' ' ? d : ''}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Đếm ngược cooldown gửi lại OTP (khớp BE: RESEND_COOLDOWN_SECONDS=60).
 * `startAt` đổi (mỗi lần gửi thành công) sẽ tự reset lại đếm ngược.
 */
export function useResendCooldown(startAt: number | null, seconds = 60) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!startAt) {
      setRemaining(0);
      return;
    }
    const tick = () => {
      const left = Math.max(0, seconds - Math.floor((Date.now() - startAt) / 1000));
      setRemaining(left);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startAt, seconds]);

  return remaining;
}
