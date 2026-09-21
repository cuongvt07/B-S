'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from '@phosphor-icons/react';
import { useVaultMe, useVerifyVaultPhone } from '@/lib/vault/useVaultAuth';
import { useRequestVaultOtp } from '@/lib/vault/useVaultData';
import { OtpInput, useResendCooldown } from '@/lib/vault/OtpInput';
import { VaultApiError } from '@/lib/vault/vaultClient';

/**
 * Bước bắt buộc ngay sau đăng ký — BE đã tự gửi OTP purpose=verify_phone lúc
 * register() thành công, trang này chỉ cần cho nhập mã (+ nút gửi lại).
 */
export default function VaultVerifyPhonePage() {
  const router = useRouter();
  const { data: me } = useVaultMe();
  const verifyPhone = useVerifyVaultPhone();
  const requestOtp = useRequestVaultOtp();

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sentAt, setSentAt] = useState<number | null>(() => Date.now());
  const cooldown = useResendCooldown(sentAt);

  async function handleVerify() {
    setError(null);
    try {
      await verifyPhone.mutateAsync({ otpCode: code });
      router.replace('/vault');
    } catch (e) {
      setError(e instanceof VaultApiError ? e.message : 'Xác thực thất bại, thử lại sau');
    }
  }

  async function handleResend() {
    setError(null);
    try {
      await requestOtp.mutateAsync({ purpose: 'verify_phone' });
      setSentAt(Date.now());
      setCode('');
    } catch (e) {
      setError(e instanceof VaultApiError ? e.message : 'Gửi lại mã thất bại, thử lại sau');
    }
  }

  const maskedPhone = me?.phone
    ? me.phone.slice(0, 4) + '*'.repeat(Math.max(0, me.phone.length - 7)) + me.phone.slice(-3)
    : '';

  return (
    <div className="flex min-h-screen sm:min-h-full flex-col justify-center px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[22px] bg-vaultgreen-soft text-vaultgreen shadow-[0_8px_20px_rgba(15,122,79,0.12)]">
            <ShieldCheck size={32} weight="fill" />
          </div>
          <h1 className="text-2xl font-black tracking-[-0.02em] text-[#0B1220]">Xác thực số điện thoại</h1>
          <p className="mt-2 text-sm text-[#667085]">
            Nhập mã 6 số vừa được gửi tới {maskedPhone || 'số điện thoại của bạn'}
          </p>
        </div>

        <OtpInput value={code} onChange={setCode} disabled={verifyPhone.isPending} />

        {error && <p className="mt-3 rounded-2xl bg-red-50 px-3.5 py-2.5 text-sm font-semibold text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleVerify}
          disabled={verifyPhone.isPending || code.length !== 6}
          className="mt-6 w-full rounded-2xl bg-vaultgreen py-3.5 text-base font-extrabold text-white shadow-[0_18px_32px_rgba(15,122,79,0.28)] transition hover:brightness-105 disabled:opacity-50"
        >
          {verifyPhone.isPending ? 'Đang xác thực...' : 'Xác nhận'}
        </button>

        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || requestOtp.isPending}
          className="mt-4 w-full text-center text-sm font-bold text-vaultgreen disabled:text-[#98A2B3]"
        >
          {cooldown > 0 ? `Gửi lại mã sau ${cooldown}s` : 'Gửi lại mã'}
        </button>
      </div>
    </div>
  );
}
