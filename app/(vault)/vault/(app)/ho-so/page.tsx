'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SlidersHorizontal, Bell, PencilSimple, ShieldCheck, LockKey, CaretRight, Fingerprint, DeviceMobile, Headset, Moon, FileText, SignOut, Plus } from '@phosphor-icons/react';
import { useVaultMe, useVaultLogout, useSetVaultPin } from '@/lib/vault/useVaultAuth';
import { useVaultSummary, useVaultBankAccounts, useAddVaultBankAccount, useRequestVaultOtp } from '@/lib/vault/useVaultData';
import { OtpInput, useResendCooldown } from '@/lib/vault/OtpInput';
import { formatVnd } from '@/lib/vault/format';
import { VaultApiError } from '@/lib/vault/vaultClient';

const BANKS = [
  { code: 'VCB', name: 'Vietcombank' },
  { code: 'TCB', name: 'Techcombank' },
  { code: 'MB', name: 'MB Bank' },
  { code: 'ACB', name: 'ACB' },
  { code: 'BIDV', name: 'BIDV' },
  { code: 'VTB', name: 'VietinBank' },
  { code: 'TPB', name: 'TPBank' },
  { code: 'VPB', name: 'VPBank' },
];

export default function VaultProfilePage() {
  const { data: me } = useVaultMe();
  const { data: summary } = useVaultSummary();
  const { data: bankAccounts } = useVaultBankAccounts();
  const addBankAccount = useAddVaultBankAccount();
  const logout = useVaultLogout();
  const requestOtp = useRequestVaultOtp();
  const setPin = useSetVaultPin();

  const [showAddBank, setShowAddBank] = useState(false);
  const [showSetPin, setShowSetPin] = useState(false);
  const [pinStep, setPinStep] = useState<'new-pin' | 'otp'>('new-pin');
  const [newPin, setNewPin] = useState('');
  const [pinOtp, setPinOtp] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinSentAt, setPinSentAt] = useState<number | null>(null);
  const pinCooldown = useResendCooldown(pinSentAt);
  const [faceIdOn, setFaceIdOn] = useState(me?.faceIdEnabled ?? false);
  const [darkMode, setDarkMode] = useState(false);
  const [bankForm, setBankForm] = useState({ bankCode: 'VCB', accountNumber: '', accountName: '' });
  const [bankError, setBankError] = useState<string | null>(null);

  async function handleAddBank(e: React.FormEvent) {
    e.preventDefault();
    setBankError(null);
    if (!bankForm.accountNumber || !bankForm.accountName) return;
    try {
      await addBankAccount.mutateAsync(bankForm);
      setBankForm({ bankCode: 'VCB', accountNumber: '', accountName: '' });
      setShowAddBank(false);
    } catch (e) {
      setBankError(e instanceof VaultApiError ? e.message : 'Thêm tài khoản thất bại, thử lại sau');
    }
  }

  function openSetPin() {
    setPinError(null);
    setNewPin('');
    setPinOtp('');
    setPinStep('new-pin');
    setShowSetPin(true);
  }

  async function handleRequestPinOtp() {
    setPinError(null);
    if (!newPin.match(/^\d{6}$/)) {
      setPinError('Mã PIN phải gồm đúng 6 chữ số');
      return;
    }

    // OTP đang TẠM TẮT (Twilio chưa cấu hình xong) — bỏ qua bước gửi/nhập
    // OTP hoàn toàn, đặt PIN thẳng luôn. Khôi phục khi me.otpEnabled = true.
    if (!me?.otpEnabled) {
      await handleConfirmSetPinDirect();
      return;
    }

    try {
      await requestOtp.mutateAsync({ purpose: 'set_pin' });
      setPinSentAt(Date.now());
      setPinStep('otp');
    } catch (e) {
      setPinError(e instanceof VaultApiError ? e.message : 'Gửi mã OTP thất bại, thử lại sau');
    }
  }

  async function handleConfirmSetPinDirect() {
    setPinError(null);
    try {
      await setPin.mutateAsync({ pin: newPin });
      setShowSetPin(false);
    } catch (e) {
      setPinError(e instanceof VaultApiError ? e.message : 'Cập nhật PIN thất bại, thử lại sau');
    }
  }

  async function handleResendPinOtp() {
    setPinError(null);
    try {
      await requestOtp.mutateAsync({ purpose: 'set_pin' });
      setPinSentAt(Date.now());
      setPinOtp('');
    } catch (e) {
      setPinError(e instanceof VaultApiError ? e.message : 'Gửi lại mã thất bại, thử lại sau');
    }
  }

  async function handleConfirmSetPin() {
    setPinError(null);
    try {
      await setPin.mutateAsync({ pin: newPin, otpCode: pinOtp });
      setShowSetPin(false);
    } catch (e) {
      setPinError(e instanceof VaultApiError ? e.message : 'Cập nhật PIN thất bại, thử lại sau');
    }
  }

  // Nút "Tiếp tục" ở bước nhập PIN mới hiển thị khác nhau tuỳ OTP bật/tắt —
  // xem JSX bên dưới dùng chung handleRequestPinOtp cho cả 2 trường hợp.

  return (
    <div className="mx-auto max-w-md px-4 pt-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#98A2B3]">Két Tài Sản &amp; Cá Nhân</p>
          <h1 className="mt-0.5 text-lg font-black tracking-[-0.02em] text-[#0B1220]">Hồ sơ &amp; An toàn</h1>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E7ECEA] bg-white text-[#475467] shadow-sm transition hover:border-vaultgreen/30 hover:text-vaultgreen">
            <SlidersHorizontal size={16} />
          </button>
          <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E7ECEA] bg-white text-[#475467] shadow-sm transition hover:border-vaultgreen/30 hover:text-vaultgreen">
            <Bell size={16} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
        </div>
      </div>

      {/* Card thông tin cá nhân */}
      <div className="rounded-[22px] border border-[#E7ECEA] bg-white p-4 shadow-[0_8px_24px_rgba(16,24,40,0.05)]">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-[#E4E7EC]">
            {me?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={me.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-extrabold text-[#667085]">
                {me?.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-[15px] font-extrabold text-[#0B1220]">{me?.name}</p>
              {me?.vipTier !== 'standard' && (
                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase text-amber-700">
                  {me?.vipTier === 'vip_gold' ? 'VIP Gold' : 'VIP Silver'}
                </span>
              )}
            </div>
            <p className="text-xs text-[#98A2B3]">Mã định danh: {me?.vaultCode}</p>
          </div>
          <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#F4F7F5] text-[#475467] transition hover:bg-[#EDF2EF]">
            <PencilSimple size={14} />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <Link href="/vault/xac-thuc" className="rounded-2xl bg-[#F8FAF9] p-3 transition hover:bg-vaultgreen-soft/60">
            <p className="flex items-center gap-1 text-[11px] text-[#98A2B3]">
              <ShieldCheck size={12} className="text-vaultgreen" /> Xác thực eKYC
            </p>
            <p className="mt-0.5 text-sm font-extrabold text-[#0B1220]">
              Cấp độ {me?.ekycLevel ?? 0}
              {Number(me?.ekycLevel ?? 0) < 2 && <span className="ml-1 text-xs font-bold text-vaultgreen">Nâng cấp →</span>}
            </p>
          </Link>
          <div className="rounded-2xl bg-[#F8FAF9] p-3">
            <p className="flex items-center gap-1 text-[11px] text-[#98A2B3]">
              <LockKey size={12} className="text-vaultgreen" /> Điểm an toàn két
            </p>
            <p className="mt-0.5 text-sm font-extrabold text-[#0B1220]">{me?.hasPinSet ? '98/100' : '60/100'}</p>
          </div>
        </div>
      </div>

      {/* Tài sản tích lũy bảo hộ */}
      <div className="relative isolate mt-4 overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#0B5C3B_0%,#0F7A4F_100%)] p-4 text-white shadow-[0_14px_32px_rgba(15,122,79,0.2)]">
        <div className="pointer-events-none absolute -right-8 -top-10 -z-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="flex items-center justify-between text-xs text-white/75">
          <span className="font-bold uppercase tracking-wide">Tài sản tích lũy bảo hộ</span>
          <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Đang sinh lời
          </span>
        </div>
        <p className="mt-1 text-2xl font-black tracking-[-0.02em]">{formatVnd(summary?.totalBalance ?? 0)} đ</p>
        <p className="mt-4 text-xs text-white/65">Tiền lãi sinh sôi (YTD)</p>
        <p className="font-extrabold text-[#D6F58D]">+{formatVnd(summary?.totalInterestReceived ?? 0)} đ</p>
      </div>

      {/* Cài đặt tài chính & két */}
      <SectionTitle>Cài Đặt Tài Chính &amp; Két</SectionTitle>
      <div className="divide-y divide-[#F0F2F1] rounded-[22px] border border-[#E7ECEA] bg-white shadow-[0_8px_24px_rgba(16,24,40,0.05)]">
        <Row
          icon={<Fingerprint size={18} weight="bold" className="text-vaultgreen" />}
          title="Tài khoản nhận tiền rút"
          subtitle={bankAccounts?.length ? bankAccounts.map((b) => `${b.bankName} (${b.maskedNumber})`).join(', ') : 'Chưa có tài khoản'}
          right={<span className="rounded-full bg-[#F4F7F5] px-2.5 py-1 text-xs font-black text-[#475467]">{bankAccounts?.length ?? 0} Thẻ</span>}
          onClick={() => setShowAddBank((v) => !v)}
        />
        <Row
          icon={<DeviceMobile size={18} weight="bold" className="text-vaultgreen" />}
          title="Hạn mức rút tiền / ngày"
          subtitle="Hạn mức theo phân hạng hiện tại"
          right={<span className="text-sm font-extrabold text-[#0B1220]">{formatVnd(me?.dailyWithdrawalLimit ?? 0)} đ</span>}
        />
      </div>

      {showAddBank && (
        <form onSubmit={handleAddBank} className="mt-3 space-y-2.5 rounded-[22px] border border-[#E7ECEA] bg-white p-4 shadow-[0_8px_24px_rgba(16,24,40,0.05)]">
          <select
            value={bankForm.bankCode}
            onChange={(e) => setBankForm((f) => ({ ...f, bankCode: e.target.value }))}
            className="w-full rounded-2xl border-2 border-[#E7ECEA] px-3 py-2.5 text-sm font-semibold outline-none focus:border-vaultgreen"
          >
            {BANKS.map((b) => (
              <option key={b.code} value={b.code}>
                {b.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Số tài khoản"
            inputMode="numeric"
            value={bankForm.accountNumber}
            onChange={(e) => setBankForm((f) => ({ ...f, accountNumber: e.target.value.replace(/\D/g, '') }))}
            className="w-full rounded-2xl border-2 border-[#E7ECEA] px-3 py-2.5 text-sm font-semibold outline-none focus:border-vaultgreen"
          />
          <input
            placeholder="Tên chủ tài khoản"
            value={bankForm.accountName}
            onChange={(e) => setBankForm((f) => ({ ...f, accountName: e.target.value }))}
            className="w-full rounded-2xl border-2 border-[#E7ECEA] px-3 py-2.5 text-sm font-semibold uppercase outline-none focus:border-vaultgreen"
          />
          {bankError && <p className="rounded-2xl bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-600">{bankError}</p>}
          <button
            type="submit"
            disabled={addBankAccount.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-vaultgreen py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(15,122,79,0.22)] transition hover:brightness-105 disabled:opacity-60"
          >
            <Plus size={16} weight="bold" /> {addBankAccount.isPending ? 'Đang thêm...' : 'Thêm tài khoản'}
          </button>
        </form>
      )}

      {/* Bảo mật */}
      <SectionTitle right={<span className="flex items-center gap-1 text-xs font-bold text-vaultgreen"><ShieldCheck size={12} weight="fill" /> An toàn cao</span>}>
        Bảo Mật &amp; Quyền Riêng Tư
      </SectionTitle>
      <div className="divide-y divide-[#F0F2F1] rounded-[22px] border border-[#E7ECEA] bg-white shadow-[0_8px_24px_rgba(16,24,40,0.05)]">
        <Row
          icon={<Fingerprint size={18} weight="bold" className="text-vaultgreen" />}
          title="Sinh trắc học Face ID / Touch ID"
          subtitle="Đăng nhập nhanh và xác nhận lệnh"
          right={<Toggle checked={faceIdOn} onChange={setFaceIdOn} />}
        />
        <Row
          icon={<LockKey size={18} weight="bold" className="text-vaultgreen" />}
          title="Mã PIN giao dịch (6 chữ số)"
          subtitle="Đổi mã PIN định kỳ bảo vệ két"
          onClick={openSetPin}
          right={
            <span className="flex items-center gap-1 text-xs font-bold text-[#667085]">
              {me?.hasPinSet ? 'Đã kích hoạt' : 'Chưa đặt'} <CaretRight size={12} />
            </span>
          }
        />
        <Link
          href="/vault/doi-so-dien-thoai"
          className="flex w-full items-center gap-3 p-3.5 text-left transition hover:bg-[#F7FAF8]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-vaultgreen-soft">
            <DeviceMobile size={18} weight="bold" className="text-vaultgreen" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[#0B1220]">Đổi số điện thoại</p>
            <p className="truncate text-xs text-[#98A2B3]">Xác thực OTP cả số cũ &amp; số mới</p>
          </div>
          <CaretRight size={14} className="text-[#98A2B3]" />
        </Link>
      </div>

      {/* Tiện ích */}
      <SectionTitle>Tiện Ích &amp; Trợ Giúp</SectionTitle>
      <div className="divide-y divide-[#F0F2F1] rounded-[22px] border border-[#E7ECEA] bg-white shadow-[0_8px_24px_rgba(16,24,40,0.05)]">
        <Row icon={<Headset size={18} weight="bold" className="text-vaultgreen" />} title="Trung tâm hỗ trợ chuyên biệt 24/7" subtitle="Chuyên viên cố vấn tài chính riêng VIP" />
        <Row
          icon={<Moon size={18} weight="bold" className="text-vaultgreen" />}
          title="Giao diện tối (Dark Mode)"
          subtitle="Tối ưu thị giác vào ban đêm"
          right={<Toggle checked={darkMode} onChange={setDarkMode} />}
        />
        <Row icon={<FileText size={18} weight="bold" className="text-vaultgreen" />} title="Điều khoản &amp; Bảo chứng lưu ký két" subtitle="Giấy phép hoạt động quản lý quỹ" />
      </div>

      <button
        type="button"
        onClick={() => logout.mutate()}
        className="mt-5 mb-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3.5 text-sm font-extrabold text-red-600 transition hover:bg-red-100"
      >
        <SignOut size={18} weight="bold" /> Đăng xuất tài khoản an toàn
      </button>

      {showSetPin && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-sm rounded-t-[28px] bg-white p-5 sm:rounded-[28px]">
            <h2 className="text-base font-extrabold text-[#0B1220]">
              {me?.hasPinSet ? 'Đổi mã PIN giao dịch' : 'Đặt mã PIN giao dịch'}
            </h2>

            {pinStep === 'new-pin' ? (
              <>
                <p className="mt-1 text-sm text-[#667085]">Nhập mã PIN mới gồm 6 chữ số dùng để xác nhận rút tiền.</p>
                <input
                  inputMode="numeric"
                  autoFocus
                  maxLength={6}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••"
                  className="mt-4 w-full rounded-2xl border-2 border-[#E7ECEA] px-4 py-3 text-center text-2xl font-black tracking-[0.5em] outline-none focus:border-vaultgreen"
                />
                {pinError && <p className="mt-3 rounded-2xl bg-red-50 px-3.5 py-2.5 text-sm font-semibold text-red-600">{pinError}</p>}
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowSetPin(false)}
                    className="rounded-2xl bg-[#F4F7F5] py-3 text-sm font-extrabold text-[#475467] transition hover:bg-[#EDF2EF]"
                  >
                    Huỷ
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestPinOtp}
                    disabled={requestOtp.isPending || setPin.isPending || newPin.length !== 6}
                    className="rounded-2xl bg-vaultgreen py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(15,122,79,0.22)] transition hover:brightness-105 disabled:opacity-50"
                  >
                    {requestOtp.isPending || setPin.isPending ? 'Đang xử lý...' : 'Tiếp tục'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mt-1 text-sm text-[#667085]">Nhập mã OTP 6 số vừa được gửi tới số điện thoại của bạn để xác nhận.</p>
                <div className="mt-4">
                  <OtpInput value={pinOtp} onChange={setPinOtp} disabled={setPin.isPending} />
                </div>
                {pinError && <p className="mt-3 rounded-2xl bg-red-50 px-3.5 py-2.5 text-sm font-semibold text-red-600">{pinError}</p>}
                <button
                  type="button"
                  onClick={handleConfirmSetPin}
                  disabled={setPin.isPending || pinOtp.length !== 6}
                  className="mt-5 w-full rounded-2xl bg-vaultgreen py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(15,122,79,0.22)] transition hover:brightness-105 disabled:opacity-50"
                >
                  {setPin.isPending ? 'Đang xác nhận...' : 'Xác nhận'}
                </button>
                <button
                  type="button"
                  onClick={handleResendPinOtp}
                  disabled={pinCooldown > 0 || requestOtp.isPending}
                  className="mt-3 w-full text-center text-sm font-bold text-vaultgreen disabled:text-[#98A2B3]"
                >
                  {pinCooldown > 0 ? `Gửi lại mã sau ${pinCooldown}s` : 'Gửi lại mã'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mb-2 mt-6 flex items-center justify-between">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#98A2B3]">{children}</h2>
      {right}
    </div>
  );
}

function Row({
  icon,
  title,
  subtitle,
  right,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onClick?: () => void;
}) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp type={onClick ? 'button' : undefined} onClick={onClick} className={`flex w-full items-center gap-3 p-3.5 text-left ${onClick ? 'transition hover:bg-[#F7FAF8]' : ''}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-vaultgreen-soft">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-[#0B1220]">{title}</p>
        {subtitle && <p className="truncate text-xs text-[#98A2B3]">{subtitle}</p>}
      </div>
      {right ?? <CaretRight size={14} className="text-[#98A2B3]" />}
    </Comp>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-vaultgreen' : 'bg-[#D0D5DD]'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? 'left-[22px]' : 'left-0.5'}`}
      />
    </button>
  );
}
