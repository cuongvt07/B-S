'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bank, CheckCircle, ClockCountdown, DownloadSimple, XCircle } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useVaultAccounts,
  useCreateVaultDeposit,
  useVaultDepositStatus,
} from '@/lib/vault/useVaultData';
import { useIdempotencyKey } from '@/lib/vault/useIdempotencyKey';
import { formatVnd } from '@/lib/vault/format';
import { VaultApiError } from '@/lib/vault/vaultClient';

const QUICK_AMOUNTS = [500_000, 2_000_000, 10_000_000, 50_000_000];

/** Đếm ngược tới 1 mốc tuyệt đối (deadline ISO string) — khác useResendCooldown (đếm từ mốc bắt đầu). */
function useCountdownTo(deadlineIso: string | undefined): number {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!deadlineIso) {
      setRemainingSeconds(0);
      return;
    }
    const deadline = new Date(deadlineIso).getTime();
    const tick = () => setRemainingSeconds(Math.max(0, Math.round((deadline - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadlineIso]);

  return remainingSeconds;
}

export default function VaultDepositPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { data: vaults } = useVaultAccounts();
  const createDeposit = useCreateVaultDeposit();

  const flexibleVault = useMemo(() => vaults?.find((v) => v.type === 'flexible') ?? vaults?.[0], [vaults]);
  const [amountInput, setAmountInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [depositId, setDepositId] = useState<number | null>(null);

  const amount = Number(amountInput.replace(/\D/g, '')) || 0;
  const idempotencyKey = useIdempotencyKey(amount);

  const { data: deposit } = useVaultDepositStatus(depositId);
  const remainingSeconds = useCountdownTo(deposit?.status === 'pending_payment' ? deposit.expiresAt : undefined);
  const [isDownloadingQr, setIsDownloadingQr] = useState(false);

  // Vừa chuyển sang success — cập nhật số dư/lịch sử 1 lần (xem ghi chú ở
  // useVaultDepositStatus vì sao không đặt side-effect này trong hook đó).
  useEffect(() => {
    if (deposit?.status === 'success') {
      qc.invalidateQueries({ queryKey: ['vault', 'summary'] });
      qc.invalidateQueries({ queryKey: ['vault', 'vaults'] });
      qc.invalidateQueries({ queryKey: ['vault', 'activity'] });
    }
  }, [deposit?.status, qc]);

  // Thành công/hết hạn — tự động điều hướng về ví sau vài giây để user kịp
  // đọc thông báo, không cần tự bấm nút.
  useEffect(() => {
    if (deposit?.status === 'success' || deposit?.status === 'expired') {
      const timer = setTimeout(() => router.replace('/vault'), 2500);
      return () => clearTimeout(timer);
    }
  }, [deposit?.status, router]);

  /**
   * Ảnh QR nằm ở domain ngoài (vietqr.app) — không thể dùng <a download>
   * trực tiếp trên <img src> vì trình duyệt sẽ điều hướng thay vì tải khi
   * link là cross-origin. Fetch về dạng blob rồi tạo link tải tạm thời;
   * nếu domain đó chặn CORS (fetch throw), fallback mở ảnh ở tab mới để
   * user tự bấm giữ/lưu ảnh theo cách thủ công.
   */
  async function handleDownloadQr() {
    if (!deposit?.qrImageUrl) return;
    setIsDownloadingQr(true);
    try {
      const response = await fetch(deposit.qrImageUrl);
      if (!response.ok) throw new Error('fetch failed');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `vm24h-qr-${deposit.paymentCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(deposit.qrImageUrl, '_blank', 'noopener,noreferrer');
    } finally {
      setIsDownloadingQr(false);
    }
  }

  async function handleConfirm() {
    setError(null);
    if (!flexibleVault) return;
    if (amount < 10_000) {
      setError('Số tiền nạp tối thiểu là 10.000đ');
      return;
    }
    try {
      const created = await createDeposit.mutateAsync({ vaultId: flexibleVault.id, amount, idempotencyKey });
      setDepositId(created.id);
    } catch (e) {
      setError(e instanceof VaultApiError ? e.message : 'Tạo lệnh nạp tiền thất bại, thử lại sau');
    }
  }

  if (deposit?.status === 'success') {
    return (
      <div className="mx-auto flex min-h-screen sm:min-h-full max-w-md flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-vaultgreen-soft text-vaultgreen">
          <CheckCircle size={36} weight="fill" />
        </span>
        <h1 className="text-xl font-black tracking-[-0.02em] text-[#0B1220]">Nạp tiền thành công</h1>
        <p className="mt-2 text-sm text-[#667085]">
          {formatVnd(deposit.amount)} đ đã được cộng vào két của bạn.
        </p>
        <p className="mt-4 text-xs font-semibold text-[#98A2B3]">Đang chuyển về ví...</p>
      </div>
    );
  }

  if (deposit?.status === 'expired') {
    return (
      <div className="mx-auto flex min-h-screen sm:min-h-full max-w-md flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
          <XCircle size={36} weight="fill" />
        </span>
        <h1 className="text-xl font-black tracking-[-0.02em] text-[#0B1220]">Phiên giao dịch quá hạn</h1>
        <p className="mt-2 text-sm text-[#667085]">
          Bạn chưa chuyển khoản trong thời gian cho phép. Vui lòng tạo lệnh nạp tiền mới.
        </p>
        <p className="mt-4 text-xs font-semibold text-[#98A2B3]">Đang chuyển về trang chủ...</p>
      </div>
    );
  }

  // Đã tạo lệnh — hiện QR chờ chuyển khoản + tự động polling xác nhận.
  if (deposit && deposit.status === 'pending_payment') {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return (
      <div className="mx-auto max-w-md px-4 pb-8 pt-5">
        <div className="mb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDepositId(null)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E7ECEA] bg-white text-[#475467] shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-[15px] font-extrabold text-[#0B1220]">Quét mã để nạp tiền</h1>
        </div>

        <div className="rounded-[22px] border border-[#E7ECEA] bg-white p-5 text-center shadow-[0_8px_24px_rgba(16,24,40,0.05)]">
          {deposit.qrImageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={deposit.qrImageUrl} alt="Mã QR chuyển khoản" className="mx-auto w-full max-w-[260px] rounded-2xl border border-[#F0F2F1]" />
              <button
                type="button"
                onClick={handleDownloadQr}
                disabled={isDownloadingQr}
                className="mx-auto mt-3 flex items-center gap-1.5 rounded-full bg-[#F4F7F5] px-4 py-2 text-xs font-extrabold text-[#475467] transition hover:bg-[#EDF2EF] disabled:opacity-50"
              >
                <DownloadSimple size={15} weight="bold" />
                {isDownloadingQr ? 'Đang tải...' : 'Tải ảnh QR'}
              </button>
            </>
          ) : (
            <p className="py-10 text-sm text-[#667085]">Chưa cấu hình tài khoản nhận tiền, vui lòng thử lại sau.</p>
          )}

          <p className="mt-4 text-2xl font-black tracking-[-0.02em] text-[#0B1220]">{formatVnd(deposit.amount)} đ</p>
          <p className="mt-1 text-xs text-[#667085]">
            Nội dung chuyển khoản: <span className="font-extrabold text-vaultgreen">{deposit.paymentCode}</span>
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-amber-50 p-3.5 text-xs text-amber-800">
          <ClockCountdown size={18} className="shrink-0 animate-pulse" />
          <span>
            Đang chờ xác nhận chuyển khoản...{' '}
            <strong className="mono font-black">
              Còn {minutes}:{seconds.toString().padStart(2, '0')}
            </strong>
            {' '}— két sẽ tự động cộng tiền ngay khi ngân hàng báo có, không cần tải lại trang.
          </span>
        </div>

        <p className="mt-4 rounded-2xl bg-[#F8FAF9] p-3.5 text-xs text-[#667085]">
          Vui lòng chuyển khoản ĐÚNG số tiền và giữ nguyên nội dung chuyển khoản (mã {deposit.paymentCode}) để hệ thống tự động khớp giao dịch.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-8 pt-5">
      <div className="mb-5 flex items-center gap-3">
        <button type="button" onClick={() => router.back()} className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E7ECEA] bg-white text-[#475467] shadow-sm transition hover:border-vaultgreen/30 hover:text-vaultgreen">
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-[15px] font-extrabold text-[#0B1220]">Nạp cất giữ</h1>
      </div>

      <div className="rounded-[22px] border border-[#E7ECEA] bg-white p-4 shadow-[0_8px_24px_rgba(16,24,40,0.05)]">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-vaultgreen-soft text-vaultgreen">
            <Bank size={18} weight="bold" />
          </span>
          <div>
            <p className="text-[11px] text-[#98A2B3]">Nạp vào két</p>
            <p className="text-sm font-extrabold text-[#0B1220]">{flexibleVault?.name ?? '—'}</p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="mb-2 text-sm font-extrabold text-[#0B1220]">Số tiền cần nạp</h2>
        <div className="flex items-center justify-between rounded-2xl border-2 border-[#E7ECEA] bg-white px-4 py-4 focus-within:border-vaultgreen">
          <input
            inputMode="numeric"
            placeholder="0"
            value={amountInput ? Number(amountInput).toLocaleString('vi-VN') : ''}
            onChange={(e) => setAmountInput(e.target.value.replace(/\D/g, ''))}
            className="w-full bg-transparent text-2xl font-black tracking-[-0.02em] text-[#0B1220] outline-none"
          />
          <span className="text-lg font-extrabold text-[#98A2B3]">đ</span>
        </div>
        <div className="mt-2.5 grid grid-cols-4 gap-2">
          {QUICK_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmountInput(String(a))}
              className={`rounded-xl py-2 text-xs font-extrabold transition ${
                amount === a ? 'bg-vaultgreen text-white shadow-sm' : 'bg-[#F4F7F5] text-[#475467] hover:bg-[#EDF2EF]'
              }`}
            >
              {a >= 1_000_000 ? `${a / 1_000_000}tr` : `${a / 1_000}k`}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 rounded-2xl bg-[#F8FAF9] p-3.5 text-xs text-[#667085]">
        Nạp tiền qua chuyển khoản ngân hàng (VietQR) — tiền vào két tự động ngay khi ngân hàng xác nhận, thường trong vài giây.
      </p>

      {error && <p className="mt-3 rounded-2xl bg-red-50 px-3.5 py-2.5 text-sm font-semibold text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleConfirm}
        disabled={createDeposit.isPending || amount <= 0}
        className="mt-6 w-full rounded-2xl bg-vaultgreen py-4 text-base font-extrabold text-white shadow-[0_18px_32px_rgba(15,122,79,0.28)] transition hover:brightness-105 disabled:opacity-50"
      >
        {createDeposit.isPending ? 'Đang tạo mã QR...' : `Tạo mã QR nạp ${formatVnd(amount)} đ`}
      </button>
    </div>
  );
}
