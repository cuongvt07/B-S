'use client';

import Link from 'next/link';
import {
  Bell,
  Eye,
  Plus,
  ArrowUp,
  CreditCard,
  Bank,
  Gift as GiftIcon,
  ChartLineUp,
  QrCode,
  Lock,
  CheckCircle,
  Sparkle,
} from '@phosphor-icons/react';
import { useVaultMe } from '@/lib/vault/useVaultAuth';
import {
  useVaultSummary,
  useVaultAccounts,
  useVaultInterestChart,
  useVaultActivity,
} from '@/lib/vault/useVaultData';
import { formatVnd, formatVaultDate } from '@/lib/vault/format';

const ACTIVITY_LABEL: Record<string, { label: string; icon: React.ReactNode }> = {
  interest: { label: 'Nhận lãi tự động hàng ngày', icon: <ChartLineUp size={18} className="text-vaultgreen" /> },
  deposit: { label: 'Nạp cất giữ', icon: <ArrowUp size={18} className="text-vaultgreen" weight="bold" /> },
  withdrawal: { label: 'Rút tiền về ngân hàng', icon: <Bank size={18} className="text-red-500" /> },
  withdrawal_refund: { label: 'Hoàn tiền rút thất bại', icon: <Bank size={18} className="text-amber-500" /> },
  referral_bonus: { label: 'Thưởng bạn bè kích hoạt két', icon: <GiftIcon size={18} className="text-vaultgreen" /> },
};

export default function VaultDashboardPage() {
  const { data: me } = useVaultMe();
  const { data: summary } = useVaultSummary();
  const { data: vaults } = useVaultAccounts();
  const { data: chart } = useVaultInterestChart();
  const { data: activity } = useVaultActivity();

  const maxChart = Math.max(1, ...(chart?.series.map((s) => s.amount) ?? [1]));

  return (
    <div className="mx-auto max-w-md px-4 pt-5">
      {/* Header user */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-full bg-[#E4E7EC]">
            {me?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={me.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-[#667085]">
                {me?.name?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-[#0B1220]">{me?.name}</span>
              {me?.vipTier !== 'standard' && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                  {me?.vipTier === 'vip_gold' ? 'VIP Gold' : 'VIP Silver'}
                </span>
              )}
            </div>
            <p className="flex items-center gap-1 text-xs text-[#667085]">
              <CheckCircle size={12} weight="fill" className="text-emerald-500" /> Két tài sản an toàn
            </p>
          </div>
        </div>
        <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F2F4F7]">
          <Bell size={18} className="text-[#475467]" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </div>

      {/* Thẻ tổng tài sản */}
      <div className="rounded-3xl bg-gradient-to-br from-vaultgreen to-vaultgreen-dark p-5 text-white shadow-xl">
        <div className="mb-2 flex items-center justify-between text-sm text-white/85">
          <span className="flex items-center gap-1.5">
            <Lock size={14} /> Tổng tài sản đang sinh lời
          </span>
          <Eye size={16} className="text-white/70" />
        </div>
        <div className="text-3xl font-black">
          {formatVnd(summary?.totalBalance ?? 0)} <span className="text-lg font-bold">đ</span>
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 font-semibold">
            <ChartLineUp size={12} /> +{summary?.monthlyGrowthPct ?? 0}% tháng này
          </span>
          <span className="text-white/80">Lãi kép tự động 24/7</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-white/10 p-3 text-sm">
          <div>
            <p className="text-white/70">Tiền gốc đã cất giữ</p>
            <p className="font-bold">{formatVnd(summary?.totalPrincipal ?? 0)} đ</p>
          </div>
          <div>
            <p className="text-white/70">Lãi lũy kế đã nhận</p>
            <p className="font-bold text-amber-300">+{formatVnd(summary?.totalInterestReceived ?? 0)} đ</p>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between rounded-2xl bg-white/10 p-3 text-sm">
          <span className="flex items-center gap-1.5 text-white/85">
            <Sparkle size={14} /> Lãi dự tính hôm nay
          </span>
          <span className="font-bold text-amber-300">+{formatVnd(summary?.estimatedDailyInterest ?? 0)} đ</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            href="/vault/nap-tien"
            className="flex items-center justify-center gap-2 rounded-xl bg-vaultgreen-gold px-4 py-3 text-sm font-bold text-[#5C4400] shadow"
          >
            <Plus size={16} weight="bold" /> Nạp cất giữ ngay
          </Link>
          <Link
            href="/vault/rut-tien"
            className="flex items-center justify-center gap-2 rounded-xl bg-white/15 px-4 py-3 text-sm font-bold text-white ring-1 ring-white/30"
          >
            <ArrowUp size={16} weight="bold" /> Rút tiền
          </Link>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="mt-4 grid grid-cols-5 gap-1 rounded-2xl bg-white p-3 shadow-sm">
        {[
          { icon: CreditCard, label: 'Nạp tiền', href: '/vault/nap-tien' },
          { icon: Bank, label: 'Rút ngân..', href: '/vault/rut-tien' },
          { icon: GiftIcon, label: 'Thưởng...', href: '/vault/gioi-thieu', hot: true },
          { icon: ChartLineUp, label: 'Lịch sử lãi', href: '/vault/giao-dich' },
          { icon: QrCode, label: 'Quét QR', href: '/vault/nap-tien' },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="relative flex flex-col items-center gap-1.5 py-1">
            {s.hot && (
              <span className="absolute right-2 top-0 rounded-full bg-red-500 px-1 text-[8px] font-bold text-white">
                HOT
              </span>
            )}
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-vaultgreen-soft text-vaultgreen">
              <s.icon size={20} />
            </span>
            <span className="text-center text-[10px] font-medium text-[#475467]">{s.label}</span>
          </Link>
        ))}
      </div>

      {/* Danh sách két */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-base font-bold text-[#0B1220]">
          Gói Két Đang Sinh Lời <span className="ml-1 text-sm font-normal text-[#667085]">({vaults?.length ?? 0} Két mở)</span>
        </h2>
        <Link href="/vault/tich-luy" className="text-sm font-semibold text-vaultgreen">
          Tất cả
        </Link>
      </div>

      <div className="mt-3 space-y-3">
        {vaults?.map((v) => (
          <div key={v.id} className="rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-vaultgreen-soft text-vaultgreen">
                  <Lock size={16} />
                </span>
                <div>
                  <p className="font-bold text-[#0B1220]">{v.name}</p>
                  <p className="text-xs text-[#667085]">
                    {v.termDays ? `Đáo hạn: ${v.maturesAt ? new Date(v.maturesAt).toLocaleDateString('vi-VN') : '—'}` : 'Rút tức thì 24/7 · Không trừ phí'}
                  </p>
                </div>
              </div>
              <span className="whitespace-nowrap rounded-full bg-vaultgreen-soft px-2.5 py-1 text-xs font-bold text-vaultgreen">
                {v.interestRateYearly}% /năm
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-dashed border-[#EAECF0] pt-3 text-sm">
              <div>
                <p className="text-[#667085]">Số dư cất giữ</p>
                <p className="text-lg font-bold text-[#0B1220]">{formatVnd(v.totalBalance)} đ</p>
              </div>
              <div className="text-right">
                <p className="text-[#667085]">Lãi dự tính/ngày</p>
                <p className="text-lg font-bold text-vaultgreen">+{formatVnd(v.estimatedDailyInterest)} đ</p>
              </div>
            </div>
          </div>
        ))}

        <Link
          href="/vault/tich-luy"
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-vaultgreen/40 py-4 text-sm font-bold text-vaultgreen"
        >
          <Plus size={18} weight="bold" /> Mở gói tích lũy sinh lời mới
        </Link>
      </div>

      {/* Biểu đồ 7 ngày */}
      <div className="mt-6 rounded-2xl border border-[#EAECF0] bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-[#0B1220]">Tăng Trưởng Lãi 7 Ngày Qua</p>
            <p className="text-xs text-[#667085]">Trung bình: +{formatVnd(chart?.average ?? 0)} đ/ngày</p>
          </div>
          <span className="rounded-full bg-vaultgreen-soft px-2.5 py-1 text-xs font-bold text-vaultgreen">
            Tổng +{formatVnd(chart?.total ?? 0)} đ
          </span>
        </div>
        <div className="mt-4 flex h-24 items-end gap-2">
          {chart?.series.map((point, i) => (
            <div key={point.date} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md bg-vaultgreen/80"
                style={{ height: `${Math.max(6, (point.amount / maxChart) * 100)}%` }}
              />
              <span className="text-[9px] text-[#98A2B3]">
                {i === chart.series.length - 1 ? 'Hôm nay' : new Date(point.date).toLocaleDateString('vi-VN', { weekday: 'short' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mời bạn */}
      <Link
        href="/vault/gioi-thieu"
        className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#4A3400] to-vaultgreen-dark p-4 text-white shadow"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-amber-300">Đặc quyền giới thiệu</p>
          <p className="mt-1 font-bold">Mời Bạn Cùng Tích Lũy</p>
          <p className="mt-0.5 text-xs text-white/75">
            Nhận ngay 50.000đ + thưởng trọn đời <span className="font-semibold text-amber-300">0.5% hoa hồng lãi</span> mỗi ngày.
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-vaultgreen-gold">
          <GiftIcon size={22} className="text-[#5C4400]" />
        </span>
      </Link>

      {/* Biến động gần đây */}
      <div className="mb-6 mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0B1220]">Biến Động Số Dư Gần Đây</h2>
          <Link href="/vault/giao-dich" className="text-sm font-semibold text-vaultgreen">
            Xem thêm
          </Link>
        </div>
        <div className="mt-3 space-y-1 rounded-2xl border border-[#EAECF0] bg-white p-2 shadow-sm">
          {activity?.slice(0, 5).map((a) => {
            const meta = ACTIVITY_LABEL[a.type] ?? { label: a.type, icon: <ChartLineUp size={18} /> };
            return (
              <div key={a.id} className="flex items-center justify-between rounded-xl px-2 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F2F4F7]">{meta.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#0B1220]">{meta.label}</p>
                    <p className="text-xs text-[#98A2B3]">{formatVaultDate(a.createdAt)}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${a.amount >= 0 ? 'text-vaultgreen' : 'text-red-500'}`}>
                  {a.amount >= 0 ? '+' : ''}
                  {formatVnd(a.amount)} đ
                </span>
              </div>
            );
          })}
          {!activity?.length && <p className="py-6 text-center text-sm text-[#98A2B3]">Chưa có biến động nào</p>}
        </div>
      </div>
    </div>
  );
}
