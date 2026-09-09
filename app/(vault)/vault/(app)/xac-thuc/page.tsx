'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, IdentificationCard, Camera, CheckCircle, Clock, XCircle } from '@phosphor-icons/react';
import { useVaultEkyc, useSubmitVaultEkyc } from '@/lib/vault/useVaultData';
import { VaultApiError } from '@/lib/vault/vaultClient';

/**
 * Nộp hồ sơ eKYC (CCCD 2 mặt) — GIAI ĐOẠN DUYỆT THỦ CÔNG bởi admin, chưa có
 * OCR tự động điền thông tin. Admin duyệt qua CMS (Vault → Ví sinh lời).
 */
export default function VaultEkycPage() {
  const router = useRouter();
  const { data: status, isLoading } = useVaultEkyc();
  const submit = useSubmitVaultEkyc();

  const [idNumber, setIdNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!idNumber.match(/^\d{9,12}$/)) {
      setError('Số CCCD/CMND không hợp lệ (9-12 chữ số)');
      return;
    }
    if (!fullName.trim()) {
      setError('Vui lòng nhập họ tên theo giấy tờ');
      return;
    }
    if (!dateOfBirth) {
      setError('Vui lòng chọn ngày sinh');
      return;
    }
    if (!frontImage || !backImage) {
      setError('Vui lòng tải lên đủ ảnh mặt trước và mặt sau CCCD');
      return;
    }

    try {
      await submit.mutateAsync({ idNumber, fullName: fullName.trim(), dateOfBirth, frontImage, backImage });
      setSuccess(true);
    } catch (e) {
      setError(e instanceof VaultApiError ? e.message : 'Nộp hồ sơ thất bại, thử lại sau');
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full min-h-screen items-center justify-center sm:min-h-full">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-vaultgreen border-t-transparent" />
      </div>
    );
  }

  // Đã có hồ sơ (chờ duyệt / đã duyệt / bị từ chối) — hiện trạng thái thay vì
  // form nộp mới (trừ khi bị từ chối thì cho nộp lại).
  if (!success && status && status.status !== 'none' && status.status !== 'rejected') {
    return (
      <div className="mx-auto max-w-md px-4 pb-8 pt-4">
        <Header router={router} />
        <StatusCard status={status.status} ekycLevel={status.ekycLevel} />
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto flex min-h-screen sm:min-h-full max-w-md flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-vaultgreen-soft text-vaultgreen">
          <CheckCircle size={36} weight="fill" />
        </span>
        <h1 className="text-xl font-bold text-[#0B1220]">Đã nộp hồ sơ thành công</h1>
        <p className="mt-2 text-sm text-[#667085]">
          Chúng tôi sẽ xem xét hồ sơ của bạn trong thời gian sớm nhất. Kết quả sẽ hiển thị ngay tại trang này.
        </p>
        <Link href="/vault/ho-so" className="mt-8 w-full rounded-xl bg-vaultgreen py-3.5 text-center text-base font-bold text-white shadow-lg">
          Về Hồ sơ &amp; An toàn
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 pb-8 pt-4">
      <Header router={router} />

      {status?.status === 'rejected' && status.rejectionReason && (
        <div className="mb-4 flex gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700">
          <XCircle size={16} className="mt-0.5 shrink-0" />
          <span>
            <strong>Hồ sơ trước bị từ chối:</strong> {status.rejectionReason}. Vui lòng nộp lại với thông tin/ảnh chính xác hơn.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
          <p className="mb-3 font-bold text-[#0B1220]">Thông tin giấy tờ</p>

          <label className="mb-1 block text-xs font-semibold text-[#344054]">Số CCCD/CMND</label>
          <input
            inputMode="numeric"
            placeholder="0xxxxxxxxxxx"
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, ''))}
            maxLength={12}
            className="mb-3 w-full rounded-xl border border-[#E4E7EC] px-3 py-2.5 text-sm outline-none focus:border-vaultgreen"
          />

          <label className="mb-1 block text-xs font-semibold text-[#344054]">Họ và tên (theo giấy tờ)</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mb-3 w-full rounded-xl border border-[#E4E7EC] px-3 py-2.5 text-sm uppercase outline-none focus:border-vaultgreen"
          />

          <label className="mb-1 block text-xs font-semibold text-[#344054]">Ngày sinh</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full rounded-xl border border-[#E4E7EC] px-3 py-2.5 text-sm outline-none focus:border-vaultgreen"
          />
        </div>

        <div className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
          <p className="mb-3 font-bold text-[#0B1220]">Ảnh CCCD/CMND</p>

          <div className="grid grid-cols-2 gap-3">
            <ImagePicker
              label="Mặt trước"
              file={frontImage}
              onPick={() => frontInputRef.current?.click()}
              inputRef={frontInputRef}
              onChange={setFrontImage}
            />
            <ImagePicker
              label="Mặt sau"
              file={backImage}
              onPick={() => backInputRef.current?.click()}
              inputRef={backInputRef}
              onChange={setBackImage}
            />
          </div>

          <p className="mt-3 text-xs text-[#98A2B3]">
            Ảnh JPG/PNG, tối đa 5MB/ảnh. Chụp rõ nét, đủ 4 góc, không bị chói sáng.
          </p>
        </div>

        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submit.isPending}
          className="w-full rounded-2xl bg-vaultgreen py-4 text-base font-bold text-white shadow-xl disabled:opacity-50"
        >
          {submit.isPending ? 'Đang nộp hồ sơ...' : 'Nộp hồ sơ xác thực'}
        </button>
      </form>
    </div>
  );
}

function Header({ router }: { router: ReturnType<typeof useRouter> }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <button type="button" onClick={() => router.back()} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F4F7]">
        <ArrowLeft size={18} />
      </button>
      <div>
        <h1 className="text-base font-bold text-[#0B1220]">Xác thực eKYC</h1>
        <p className="text-xs text-[#667085]">Cấp 2 — nâng hạn mức rút/nạp tiền</p>
      </div>
    </div>
  );
}

function StatusCard({ status, ekycLevel }: { status: 'pending' | 'approved'; ekycLevel: string }) {
  if (status === 'approved' || Number(ekycLevel) >= 2) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-[#EAECF0] bg-white p-6 text-center shadow-sm">
        <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-vaultgreen-soft text-vaultgreen">
          <CheckCircle size={28} weight="fill" />
        </span>
        <p className="font-bold text-[#0B1220]">Đã xác thực cấp 2</p>
        <p className="mt-1 text-sm text-[#667085]">Tài khoản của bạn đã được xác thực đầy đủ.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center rounded-2xl border border-[#EAECF0] bg-white p-6 text-center shadow-sm">
      <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <Clock size={28} />
      </span>
      <p className="font-bold text-[#0B1220]">Hồ sơ đang chờ duyệt</p>
      <p className="mt-1 text-sm text-[#667085]">Chúng tôi sẽ xem xét hồ sơ trong thời gian sớm nhất.</p>
    </div>
  );
}

function ImagePicker({
  label,
  file,
  onPick,
  inputRef,
  onChange,
}: {
  label: string;
  file: File | null;
  onPick: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (f: File | null) => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onPick}
        className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[#D0D5DD] bg-[#F8FAF9] text-[#98A2B3]"
      >
        {file ? (
          <>
            <IdentificationCard size={24} className="text-vaultgreen" />
            <span className="max-w-full truncate px-2 text-[10px] font-semibold text-vaultgreen">{file.name}</span>
          </>
        ) : (
          <>
            <Camera size={22} />
            <span className="text-xs font-semibold">{label}</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
