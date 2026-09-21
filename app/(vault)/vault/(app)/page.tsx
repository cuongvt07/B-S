'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  ArrowUp,
  Bank,
  Bell,
  CaretRight,
  ChartLineUp,
  CreditCard,
  Eye,
  EyeSlash,
  Gift as GiftIcon,
  LockKey,
  Plus,
  ShieldCheck,
  Sparkle,
  TrendUp,
  Wallet,
} from '@phosphor-icons/react';
import { useVaultMe } from '@/lib/vault/useVaultAuth';
import {
  useVaultAccounts,
  useVaultActivity,
  useVaultInterestChart,
  useVaultSummary,
} from '@/lib/vault/useVaultData';
import { formatVaultDate, formatVnd } from '@/lib/vault/format';

const ACTIVITY_LABEL: Record<string, { label: string; icon: React.ReactNode; tone: string }> = {
  interest: { label: 'Lãi tự động hàng ngày', icon: <TrendUp size={17} weight="bold" />, tone: 'text-vaultgreen' },
  deposit: { label: 'Nạp tiền vào két', icon: <ArrowUp size={17} weight="bold" />, tone: 'text-vaultgreen' },
  withdrawal: { label: 'Rút tiền về ngân hàng', icon: <Bank size={17} />, tone: 'text-red-500' },
  withdrawal_refund: { label: 'Hoàn tiền rút thất bại', icon: <Bank size={17} />, tone: 'text-amber-500' },
  referral_bonus: { label: 'Thưởng giới thiệu bạn bè', icon: <GiftIcon size={17} />, tone: 'text-vaultgreen' },
};

const QUICK_ACTIONS = [
  { label: 'Nạp tiền', helper: 'Tăng số dư', href: '/vault/nap-tien', icon: CreditCard, tone: 'bg-vaultgreen-soft text-vaultgreen' },
  { label: 'Rút tiền', helper: 'Về ngân hàng', href: '/vault/rut-tien', icon: Bank, tone: 'bg-[#FFF1F0] text-red-500' },
  { label: 'Lịch sử', helper: 'Xem biến động', href: '/vault/giao-dich', icon: ChartLineUp, tone: 'bg-[#EEF4FF] text-[#356AE6]' },
  { label: 'Giới thiệu', helper: 'Nhận thưởng', href: '/vault/gioi-thieu', icon: GiftIcon, tone: 'bg-[#FFF7E3] text-[#C98900]' },
] as const;

export default function VaultDashboardPage() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const { data: me } = useVaultMe();
  const { data: summary } = useVaultSummary();
  const { data: vaults } = useVaultAccounts();
  const { data: chart } = useVaultInterestChart();
  const { data: activity } = useVaultActivity();

  const maxChart = Math.max(1, ...(chart?.series.map((s) => s.amount) ?? [1]));
  const visibleActivity = activity?.slice(0, 4) ?? [];
  const initials = me?.name?.trim()?.[0]?.toUpperCase() ?? 'V';
  const displayBalance = isBalanceVisible ? `${formatVnd(summary?.totalBalance ?? 0)} đ` : '••••••••••';

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-6 pt-5 sm:px-5">
      <header className="mb-5 flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-vaultgreen text-base font-extrabold text-white shadow-sm">
            {me?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={me.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
            <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-300" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#98A2B3]">Ví sinh lời</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <h1 className="truncate text-[15px] font-extrabold text-[#0B1220]">Xin chào, {me?.name}</h1>
              {me?.vipTier !== 'standard' && (
                <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-amber-700">
                  {me?.vipTier === 'vip_gold' ? 'Gold' : 'Silver'}
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          aria-label="Thông báo"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#E7ECEA] bg-white text-[#475467] shadow-sm transition hover:border-vaultgreen/30 hover:text-vaultgreen"
        >
          <Bell size={18} weight="regular" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
      </header>

      <section className="relative isolate overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0B5C3B_0%,#0F7A4F_58%,#17915E_100%)] p-5 text-white shadow-[0_18px_40px_rgba(15,122,79,0.22)]">
        <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 left-20 -z-10 h-48 w-48 rounded-full bg-[#B8F26D]/10 blur-3xl" />

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-xs font-semibold text-white/75">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/12"><Wallet size={15} weight="bold" /></span>
            Tổng tài sản đang sinh lời
          </span>
          <button
            type="button"
            aria-label={isBalanceVisible ? 'Ẩn số dư' : 'Hiện số dư'}
            onClick={() => setIsBalanceVisible((visible) => !visible)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/75 transition hover:bg-white/20 hover:text-white"
          >
            {isBalanceVisible ? <Eye size={17} /> : <EyeSlash size={17} />}
          </button>
        </div>

        <div className="mt-4 flex items-end gap-2">
          <p className="text-[clamp(2rem,9vw,2.6rem)] font-black leading-none tracking-[-0.04em]">{displayBalance}</p>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/14 px-2.5 py-1 font-bold text-white">
            <TrendUp size={12} weight="bold" /> +{summary?.monthlyGrowthPct ?? 0}% tháng này
          </span>
          <span className="text-white/65">Cập nhật tự động mỗi ngày</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl bg-black/10 p-3">
            <p className="text-[11px] text-white/60">Tiền gốc</p>
            <p className="mt-1 text-sm font-extrabold">{isBalanceVisible ? `${formatVnd(summary?.totalPrincipal ?? 0)} đ` : '••••••'}</p>
          </div>
          <div className="rounded-2xl bg-black/10 p-3">
            <p className="text-[11px] text-white/60">Lãi đã nhận</p>
            <p className="mt-1 text-sm font-extrabold text-[#D6F58D]">+{isBalanceVisible ? `${formatVnd(summary?.totalInterestReceived ?? 0)} đ` : '••••••'}</p>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-3.5 py-3">
          <span className="flex items-center gap-2 text-xs font-semibold text-white/80"><Sparkle size={15} weight="fill" className="text-[#D6F58D]" /> Lãi dự tính hôm nay</span>
          <span className="text-sm font-black text-[#D6F58D]">+{formatVnd(summary?.estimatedDailyInterest ?? 0)} đ</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <Link href="/vault/nap-tien" className="flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#D6F58D] px-3 text-xs font-extrabold text-[#153D2A] shadow-lg shadow-black/10 transition hover:brightness-105">
            <Plus size={16} weight="bold" /> Nạp tiền
          </Link>
          <Link href="/vault/rut-tien" className="flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-3 text-xs font-extrabold text-white transition hover:bg-white/20">
            <ArrowUp size={16} weight="bold" /> Rút tiền
          </Link>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-4 gap-2 rounded-[24px] border border-[#E7ECEA] bg-white p-2.5 shadow-[0_8px_24px_rgba(16,24,40,0.05)]">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} className="group flex min-w-0 flex-col items-center gap-2 rounded-2xl px-1 py-2 text-center transition hover:bg-[#F7FAF8]">
              <span className={`flex h-10 w-10 items-center justify-center rounded-2xl transition group-hover:scale-105 ${action.tone}`}><Icon size={19} weight="bold" /></span>
              <span className="truncate text-[11px] font-extrabold text-[#344054]">{action.label}</span>
              <span className="-mt-1 truncate text-[9px] text-[#98A2B3]">{action.helper}</span>
            </Link>
          );
        })}
      </section>

      {/* Dòng tiền gần nhất — ưu tiên hiển thị NGAY, không phải cuộn sâu mới thấy */}
      <section className="mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#0B1220]">Biến động gần đây</h2>
          <Link href="/vault/giao-dich" className="flex items-center gap-1 text-xs font-extrabold text-vaultgreen">Xem thêm <CaretRight size={14} weight="bold" /></Link>
        </div>
        <div className="mt-2 divide-y divide-[#F0F2F1] rounded-[22px] border border-[#E7ECEA] bg-white px-3 shadow-[0_8px_24px_rgba(16,24,40,0.05)]">
          {visibleActivity.slice(0, 3).map((item) => {
            const meta = ACTIVITY_LABEL[item.type] ?? { label: item.type, icon: <ChartLineUp size={17} />, tone: 'text-vaultgreen' };
            return (
              <div key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#F4F7F5] ${meta.tone}`}>{meta.icon}</span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-[#344054]">{meta.label}</p>
                    <p className="mt-0.5 text-[10px] text-[#98A2B3]">{formatVaultDate(item.createdAt)}</p>
                  </div>
                </div>
                <span className={`shrink-0 text-xs font-black ${item.amount >= 0 ? 'text-vaultgreen' : 'text-red-500'}`}>
                  {item.amount >= 0 ? '+' : ''}{formatVnd(item.amount)} đ
                </span>
              </div>
            );
          })}
          {!visibleActivity.length && <p className="py-6 text-center text-xs text-[#98A2B3]">Chưa có biến động nào.</p>}
        </div>
      </section>

      <section className="mt-7">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#98A2B3]">Danh mục đầu tư</p>
            <h2 className="mt-1 text-lg font-black tracking-[-0.02em] text-[#0B1220]">Các két đang sinh lời</h2>
          </div>
          <Link href="/vault/tich-luy" className="flex items-center gap-1 text-xs font-extrabold text-vaultgreen">Xem tất cả <ArrowRight size={14} weight="bold" /></Link>
        </div>

        <div className="mt-3 space-y-3">
          {vaults?.map((vault) => (
            <div key={vault.id} className="rounded-[22px] border border-[#E7ECEA] bg-white p-4 shadow-[0_8px_24px_rgba(16,24,40,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(16,24,40,0.08)]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-vaultgreen-soft text-vaultgreen"><LockKey size={18} weight="bold" /></span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-[#0B1220]">{vault.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-[#667085]">
                      <ShieldCheck size={13} weight="fill" className="text-vaultgreen" />
                      {vault.termDays ? `Đáo hạn ${vault.maturesAt ? new Date(vault.maturesAt).toLocaleDateString('vi-VN') : '—'}` : 'Linh hoạt · rút khi cần'}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-vaultgreen-soft px-2.5 py-1 text-[11px] font-black text-vaultgreen">{vault.interestRateYearly}%/năm</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-dashed border-[#E7ECEA] pt-3">
                <div>
                  <p className="text-[11px] text-[#98A2B3]">Số dư hiện tại</p>
                  <p className="mt-1 text-base font-black text-[#0B1220]">{formatVnd(vault.totalBalance)} đ</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-[#98A2B3]">Lãi dự tính/ngày</p>
                  <p className="mt-1 text-base font-black text-vaultgreen">+{formatVnd(vault.estimatedDailyInterest)} đ</p>
                </div>
              </div>
            </div>
          ))}

          {!vaults?.length && (
            <div className="rounded-[22px] border border-dashed border-vaultgreen/30 bg-vaultgreen-soft/35 px-5 py-7 text-center">
              <Wallet size={28} className="mx-auto text-vaultgreen" />
              <p className="mt-3 text-sm font-extrabold text-[#0B5C3B]">Chưa có két tích lũy</p>
              <p className="mt-1 text-xs text-[#667085]">Mở két đầu tiên để bắt đầu nhận lãi tự động.</p>
            </div>
          )}

          <Link href="/vault/tich-luy" className="flex min-h-12 items-center justify-center gap-2 rounded-[18px] border border-dashed border-vaultgreen/45 bg-white text-xs font-extrabold text-vaultgreen transition hover:bg-vaultgreen-soft/40">
            <Plus size={17} weight="bold" /> Mở gói tích lũy mới
          </Link>
        </div>
      </section>

      <section className="mt-7 rounded-[22px] border border-[#E7ECEA] bg-white p-4 shadow-[0_8px_24px_rgba(16,24,40,0.05)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-[#0B1220]">Lãi trong 7 ngày</p>
            <p className="mt-1 text-[11px] text-[#98A2B3]">Trung bình +{formatVnd(chart?.average ?? 0)} đ/ngày</p>
          </div>
          <span className="rounded-full bg-vaultgreen-soft px-2.5 py-1 text-[11px] font-black text-vaultgreen">+{formatVnd(chart?.total ?? 0)} đ</span>
        </div>
        <div className="mt-5 flex h-28 items-end gap-1.5">
          {(chart?.series ?? []).map((point, index) => (
            <div key={point.date} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <div className="flex h-20 w-full items-end rounded-t-lg bg-[#F0F5F2]">
                <div className="w-full rounded-t-lg bg-gradient-to-t from-vaultgreen to-[#45B67B] transition-all" style={{ height: `${Math.max(8, (point.amount / maxChart) * 100)}%` }} />
              </div>
              <span className="truncate text-[9px] text-[#98A2B3]">{index === (chart?.series.length ?? 1) - 1 ? 'Nay' : new Date(point.date).toLocaleDateString('vi-VN', { weekday: 'short' })}</span>
            </div>
          ))}
          {!chart?.series?.length && <p className="w-full py-7 text-center text-xs text-[#98A2B3]">Chưa có dữ liệu lãi để hiển thị.</p>}
        </div>
      </section>

      <Link href="/vault/gioi-thieu" className="group mt-4 flex items-center justify-between overflow-hidden rounded-[22px] bg-[linear-gradient(120deg,#243E2B,#0B5C3B)] p-4 text-white shadow-[0_12px_28px_rgba(11,92,59,0.16)]">
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#D6F58D]">Đặc quyền thành viên</p>
          <p className="mt-1 text-sm font-extrabold">Mời bạn cùng tích lũy</p>
          <p className="mt-1 text-[11px] leading-5 text-white/70">Nhận thưởng khi bạn bè kích hoạt két.</p>
        </div>
        <span className="ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D6F58D] text-[#315B2F] transition group-hover:scale-105"><GiftIcon size={21} weight="bold" /></span>
      </Link>
    </div>
  );
}
