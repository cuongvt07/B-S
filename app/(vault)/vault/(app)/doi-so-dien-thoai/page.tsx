'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, DeviceMobile, CheckCircle } from '@phosphor-icons/react';
import { useVaultMe } from '@/lib/vault/useVaultAuth';
import {
  useStartChangeVaultPhone,
  useVerifyOldVaultPhone,
  useVerifyNewVaultPhone,
} from '@/lib/vault/useVaultData';
import { OtpInput, useResendCooldown } from '@/lib/vault/OtpInput';
import { VaultApiError } from '@/lib/vault/vaultClient';

type Step = 'start' | 'verify-old' | 'verify-new' | 'done';

/**
 * Đổi số điện thoại — 3 bước tuần tự khớp VaultChangePhoneController ở BE:
 * gửi OTP số cũ -> xác nhận OTP số cũ + khai số mới -> gửi & xác nhận OTP
 * số mới. Đây là thao tác nhạy cảm nhất nên bắt buộc OTP cả 2 đầu số.
 */
export default function VaultChangePhonePage() {
  const router = useRouter();
  const { data: me } = useVaultMe();
  const start = useStartChangeVaultPhone();
  const verifyOld = useVerifyOldVaultPhone();
  const verifyNew = useVerifyNewVaultPhone();

  const [step, setStep] = useState<Step>('start');
  const [newPhone, setNewPhone] = useState('');
  const [oldOtp, setOldOtp] = useState('');
  const [newOtp, setNewOtp] = useState('');
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [oldSentAt, setOldSentAt] = useState<number | null>(null);
  const [newSentAt, setNewSentAt] = useState<number | null>(null);
  const oldCooldown = useResendCooldown(oldSentAt);
  const newCooldown = useResendCooldown(newSentAt);

  async function handleStart() {
    setError(null);
    try {
      await start.mutateAsync();
      setOldSentAt(Date.now());
      setStep('verify-old');
    } catch (e) {
      setError(e instanceof VaultApiError ? e.message : 'Gửi mã OTP thất bại, thử lại sau');
    }
  }

  async function handleResendOld() {
    setError(null);
    try {
      await start.mutateAsync();
      setOldSentAt(Date.now());
      setOldOtp('');
    } catch (e) {
      setError(e instanceof VaultApiError ? e.message : 'Gửi lại mã thất bại, thử lại sau');
    }
  }

  async function handleVerifyOld() {
    setError(null);
    if (!newPhone.match(/^0\d{9,10}$/)) {
      setError('Số điện thoại mới không hợp lệ');
      return;
    }
    try {
      const res = await verifyOld.mutateAsync({ otpCode: oldOtp, newPhone });
      setSessionToken(res.sessionToken);
      setNewSentAt(Date.now());
      setStep('verify-new');
    } catch (e) {
      setError(e instanceof VaultApiError ? e.message : 'Xác thực thất bại, thử lại sau');
    }
  }

  async function handleResendNew() {
    setError(null);
    if (!newPhone.match(/^0\d{9,10}$/)) return;
    try {
      const res = await verifyOld.mutateAsync({ otpCode: oldOtp, newPhone });
      setSessionToken(res.sessionToken);
      setNewSentAt(Date.now());
      setNewOtp('');
    } catch (e) {
      setError(e instanceof VaultApiError ? e.message : 'Gửi lại mã thất bại, thử lại sau');
    }
  }

  async function handleVerifyNew() {
    setError(null);
    if (!sessionToken) return;
    try {
      await verifyNew.mutateAsync({ sessionToken, otpCode: newOtp });
      setStep('done');
    } catch (e) {
      setError(e instanceof VaultApiError ? e.message : 'Xác thực thất bại, thử lại sau');
    }
  }

  if (step === 'done') {
    return (
      <div className="mx-auto flex min-h-screen sm:min-h-full max-w-md flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-vaultgreen-soft text-vaultgreen">
          <CheckCircle size={36} weight="fill" />
        </span>
        <h1 className="text-xl font-bold text-[#0B1220]">Đã đổi số điện thoại thành công</h1>
        <p className="mt-2 text-sm text-[#667085]">Số điện thoại mới của bạn là {newPhone}.</p>
        <button
          type="button"
          onClick={() => router.replace('/vault/ho-so')}
          className="mt-8 w-full rounded-xl bg-vaultgreen py-3.5 text-center text-base font-bold text-white shadow-lg"
        >
          Về Hồ sơ &amp; An toàn
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-8 pt-4">
      <div className="mb-6 flex items-center gap-3">
        <button type="button" onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F4F7]">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-base font-bold text-[#0B1220]">Đổi số điện thoại</h1>
          <p className="text-xs text-[#667085]">Số hiện tại: {me?.phone}</p>
        </div>
      </div>

      {step === 'start' && (
        <div className="rounded-2xl border border-[#EAECF0] bg-white p-5 text-center shadow-sm">
          <span className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-vaultgreen-soft text-vaultgreen">
            <DeviceMobile size={26} />
          </span>
          <p className="text-sm text-[#667085]">
            Để bảo vệ tài khoản, chúng tôi sẽ gửi mã OTP xác nhận tới cả số điện thoại hiện tại và số điện thoại mới.
          </p>
          {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={handleStart}
            disabled={start.isPending}
            className="mt-5 w-full rounded-xl bg-vaultgreen py-3.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {start.isPending ? 'Đang gửi mã...' : 'Gửi mã xác nhận'}
          </button>
        </div>
      )}

      {step === 'verify-old' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
            <p className="mb-2 text-sm font-bold text-[#0B1220]">Bước 1: Xác nhận số điện thoại hiện tại</p>
            <OtpInput value={oldOtp} onChange={setOldOtp} disabled={verifyOld.isPending} />
            <button
              type="button"
              onClick={handleResendOld}
              disabled={oldCooldown > 0 || start.isPending}
              className="mt-3 w-full text-center text-sm font-semibold text-vaultgreen disabled:text-[#98A2B3]"
            >
              {oldCooldown > 0 ? `Gửi lại mã sau ${oldCooldown}s` : 'Gửi lại mã'}
            </button>
          </div>

          <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
            <label className="mb-1 block text-xs font-semibold text-[#344054]">Số điện thoại mới</label>
            <input
              type="tel"
              inputMode="tel"
              placeholder="09xxxxxxxx"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-xl border border-[#E4E7EC] px-3 py-2.5 text-sm outline-none focus:border-vaultgreen"
            />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={handleVerifyOld}
            disabled={verifyOld.isPending || oldOtp.length !== 6 || !newPhone}
            className="w-full rounded-2xl bg-vaultgreen py-4 text-base font-bold text-white shadow-xl disabled:opacity-50"
          >
            {verifyOld.isPending ? 'Đang xử lý...' : 'Tiếp tục'}
          </button>
        </div>
      )}

      {step === 'verify-new' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
            <p className="mb-2 text-sm font-bold text-[#0B1220]">Bước 2: Xác nhận số điện thoại mới ({newPhone})</p>
            <OtpInput value={newOtp} onChange={setNewOtp} disabled={verifyNew.isPending} />
            <button
              type="button"
              onClick={handleResendNew}
              disabled={newCooldown > 0 || verifyOld.isPending}
              className="mt-3 w-full text-center text-sm font-semibold text-vaultgreen disabled:text-[#98A2B3]"
            >
              {newCooldown > 0 ? `Gửi lại mã sau ${newCooldown}s` : 'Gửi lại mã'}
            </button>
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={handleVerifyNew}
            disabled={verifyNew.isPending || newOtp.length !== 6}
            className="w-full rounded-2xl bg-vaultgreen py-4 text-base font-bold text-white shadow-xl disabled:opacity-50"
          >
            {verifyNew.isPending ? 'Đang xử lý...' : 'Hoàn tất đổi số điện thoại'}
          </button>
        </div>
      )}
    </div>
  );
}
