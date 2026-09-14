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
    try {
      await requestOtp.mutateAsync({ purpose: 'set_pin' });
      setPinSentAt(Date.now());
      setPinStep('otp');
    } catch (e) {
      setPinError(e instanceof VaultApiError ? e.message : 'Gửi mã OTP thất bại, thử lại sau');
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

  return (
    <div className="mx-auto max-w-md px-4 pt-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-[#667085]">Két Tài Sản &amp; Cá Nhân</p>
          <h1 className="text-lg font-bold text-[#0B1220]">Hồ sơ &amp; An toàn</h1>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F4F7]">
            <SlidersHorizontal size={16} />
          </button>
          <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F4F7]">
            <Bell size={16} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>
      </div>

      {/* Card thông tin cá nhân */}
      <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-full bg-[#E4E7EC]">
            {me?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={me.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-bold text-[#667085]">
                {me?.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-bold text-[#0B1220]">{me?.name}</p>
              {me?.vipTier !== 'standard' && (
                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                  {me?.vipTier === 'vip_gold' ? 'VIP Gold' : 'VIP Silver'}
                </span>
              )}
            </div>
            <p className="text-xs text-[#667085]">Mã định danh: {me?.vaultCode}</p>
          </div>
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F2F4F7]">
            <PencilSimple size={14} />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link href="/vault/xac-thuc" className="rounded-xl bg-[#F8FAF9] p-2.5">
            <p className="flex items-center gap-1 text-[11px] text-[#667085]">
              <ShieldCheck size={12} className="text-vaultgreen" /> Xác thực eKYC
            </p>
            <p className="text-sm font-bold text-[#0B1220]">
              Cấp độ {me?.ekycLevel ?? 0}
              {Number(me?.ekycLevel ?? 0) < 2 && <span className="ml-1 text-xs font-semibold text-vaultgreen">Nâng cấp →</span>}
            </p>
          </Link>
          <div className="rounded-xl bg-[#F8FAF9] p-2.5">
            <p className="flex items-center gap-1 text-[11px] text-[#667085]">
              <LockKey size={12} className="text-vaultgreen" /> Điểm an toàn két
            </p>
            <p className="text-sm font-bold text-[#0B1220]">{me?.hasPinSet ? '98/100' : '60/100'}</p>
          </div>
        </div>
      </div>

      {/* Tài sản tích lũy bảo hộ */}
      <div className="mt-4 rounded-2xl bg-gradient-to-br from-vaultgreen to-vaultgreen-dark p-4 text-white shadow-lg">
        <div className="flex items-center justify-between text-xs text-white/80">
          <span className="font-bold uppercase tracking-wide">Tài sản tích lũy bảo hộ</span>
          <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Đang sinh lời
          </span>
        </div>
        <p className="mt-1 text-2xl font-black">{formatVnd(summary?.totalBalance ?? 0)} đ</p>
        <p className="mt-4 text-xs text-white/70">Tiền lãi sinh sôi (YTD)</p>
        <p className="font-bold text-amber-300">+{formatVnd(summary?.totalInterestReceived ?? 0)} đ</p>
      </div>

      {/* Cài đặt tài chính & két */}
      <SectionTitle>Cài Đặt Tài Chính &amp; Két</SectionTitle>
      <div className="divide-y divide-[#EAECF0] rounded-2xl border border-[#EAECF0] bg-white shadow-sm">
        <Row
          icon={<Fingerprint size={18} className="text-vaultgreen" />}
          title="Tài khoản nhận tiền rút"
          subtitle={bankAccounts?.length ? bankAccounts.map((b) => `${b.bankName} (${b.maskedNumber})`).join(', ') : 'Chưa có tài khoản'}
          right={<span className="rounded-full bg-[#F2F4F7] px-2 py-0.5 text-xs font-bold">{bankAccounts?.length ?? 0} Thẻ</span>}
          onClick={() => setShowAddBank((v) => !v)}
        />
        <Row
          icon={<DeviceMobile size={18} className="text-vaultgreen" />}
          title="Hạn mức rút tiền / ngày"
          subtitle="Hạn mức theo phân hạng hiện tại"
          right={<span className="text-sm font-bold text-[#0B1220]">{formatVnd(me?.dailyWithdrawalLimit ?? 0)} đ</span>}
        />
      </div>

      {showAddBank && (
        <form onSubmit={handleAddBank} className="mt-3 space-y-2.5 rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
          <select
            value={bankForm.bankCode}
            onChange={(e) => setBankForm((f) => ({ ...f, bankCode: e.target.value }))}
            className="w-full rounded-xl border border-[#E4E7EC] px-3 py-2.5 text-sm"
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
            className="w-full rounded-xl border border-[#E4E7EC] px-3 py-2.5 text-sm"
          />
          <input
            placeholder="Tên chủ tài khoản"
            value={bankForm.accountName}
            onChange={(e) => setBankForm((f) => ({ ...f, accountName: e.target.value }))}
            className="w-full rounded-xl border border-[#E4E7EC] px-3 py-2.5 text-sm uppercase"
          />
          {bankError && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{bankError}</p>}
          <button
            type="submit"
            disabled={addBankAccount.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-vaultgreen py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            <Plus size={16} weight="bold" /> {addBankAccount.isPending ? 'Đang thêm...' : 'Thêm tài khoản'}
          </button>
        </form>
      )}

      {/* Bảo mật */}
      <SectionTitle right={<span className="flex items-center gap-1 text-xs font-semibold text-vaultgreen"><ShieldCheck size={12} weight="fill" /> An toàn cao</span>}>
        Bảo Mật &amp; Quyền Riêng Tư
      </SectionTitle>
      <div className="divide-y divide-[#EAECF0] rounded-2xl border border-[#EAECF0] bg-white shadow-sm">
        <Row
          icon={<Fingerprint size={18} className="text-vaultgreen" />}
          title="Sinh trắc học Face ID / Touch ID"
          subtitle="Đăng nhập nhanh và xác nhận lệnh"
          right={<Toggle checked={faceIdOn} onChange={setFaceIdOn} />}
        />
        <Row
          icon={<LockKey size={18} className="text-vaultgreen" />}
          title="Mã PIN giao dịch (6 chữ số)"
          subtitle="Đổi mã PIN định kỳ bảo vệ két"
          onClick={openSetPin}
          right={
            <span className="flex items-center gap-1 text-xs font-semibold text-[#667085]">
              {me?.hasPinSet ? 'Đã kích hoạt' : 'Chưa đặt'} <CaretRight size={12} />
            </span>
          }
        />
        <Link
          href="/vault/doi-so-dien-thoai"
          className="flex w-full items-center gap-3 p-3.5 text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-vaultgreen-soft">
            <DeviceMobile size={18} className="text-vaultgreen" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#0B1220]">Đổi số điện thoại</p>
            <p className="truncate text-xs text-[#98A2B3]">Xác thực OTP cả số cũ &amp; số mới</p>
          </div>
          <CaretRight size={14} className="text-[#98A2B3]" />
        </Link>
      </div>

      {/* Tiện ích */}
      <SectionTitle>Tiện Ích &amp; Trợ Giúp</SectionTitle>
      <div className="divide-y divide-[#EAECF0] rounded-2xl border border-[#EAECF0] bg-white shadow-sm">
        <Row icon={<Headset size={18} className="text-vaultgreen" />} title="Trung tâm hỗ trợ chuyên biệt 24/7" subtitle="Chuyên viên cố vấn tài chính riêng VIP" />
        <Row
          icon={<Moon size={18} className="text-vaultgreen" />}
          title="Giao diện tối (Dark Mode)"
          subtitle="Tối ưu thị giác vào ban đêm"
          right={<Toggle checked={darkMode} onChange={setDarkMode} />}
        />
        <Row icon={<FileText size={18} className="text-vaultgreen" />} title="Điều khoản &amp; Bảo chứng lưu ký két" subtitle="Giấy phép hoạt động quản lý quỹ" />
      </div>

      <button
        type="button"
        onClick={() => logout.mutate()}
        className="mt-5 mb-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3.5 text-sm font-bold text-red-600"
      >
        <SignOut size={18} /> Đăng xuất tài khoản an toàn
      </button>

      {showSetPin && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div className="w-full max-w-sm rounded-t-3xl bg-white p-5 sm:rounded-3xl">
            <h2 className="text-base font-bold text-[#0B1220]">
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
                  className="mt-4 w-full rounded-xl border-2 border-[#EAECF0] px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] outline-none focus:border-vaultgreen"
                />
                {pinError && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{pinError}</p>}
                <div className="mt-5 grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowSetPin(false)}
                    className="rounded-xl bg-[#F2F4F7] py-3 text-sm font-bold text-[#475467]"
                  >
                    Huỷ
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestPinOtp}
                    disabled={requestOtp.isPending || newPin.length !== 6}
                    className="rounded-xl bg-vaultgreen py-3 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {requestOtp.isPending ? 'Đang gửi mã...' : 'Tiếp tục'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mt-1 text-sm text-[#667085]">Nhập mã OTP 6 số vừa được gửi tới số điện thoại của bạn để xác nhận.</p>
                <div className="mt-4">
                  <OtpInput value={pinOtp} onChange={setPinOtp} disabled={setPin.isPending} />
                </div>
                {pinError && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{pinError}</p>}
                <button
                  type="button"
                  onClick={handleConfirmSetPin}
                  disabled={setPin.isPending || pinOtp.length !== 6}
                  className="mt-5 w-full rounded-xl bg-vaultgreen py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  {setPin.isPending ? 'Đang xác nhận...' : 'Xác nhận'}
                </button>
                <button
                  type="button"
                  onClick={handleResendPinOtp}
                  disabled={pinCooldown > 0 || requestOtp.isPending}
                  className="mt-3 w-full text-center text-sm font-semibold text-vaultgreen disabled:text-[#98A2B3]"
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
    <div className="mb-2 mt-5 flex items-center justify-between">
      <h2 className="text-sm font-bold text-[#0B1220]">{children}</h2>
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
    <Comp type={onClick ? 'button' : undefined} onClick={onClick} className="flex w-full items-center gap-3 p-3.5 text-left">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-vaultgreen-soft">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#0B1220]">{title}</p>
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
