'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useVaultLogin } from '@/lib/vault/useVaultAuth';
import { VaultApiError } from '@/lib/vault/vaultClient';

const schema = z.object({
  phone: z.string().regex(/^0\d{9,10}$/, 'Số điện thoại không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});

type FormValues = z.infer<typeof schema>;

export default function VaultLoginPage() {
  const router = useRouter();
  const login = useVaultLogin();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await login.mutateAsync(values);
      router.replace('/vault');
    } catch (e) {
      setServerError(e instanceof VaultApiError ? e.message : 'Đăng nhập thất bại, thử lại sau');
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-vaultgreen text-2xl font-black text-white shadow-lg">
            V
          </div>
          <h1 className="text-2xl font-bold text-[#0B1220]">Đăng nhập Vault</h1>
          <p className="mt-1 text-sm text-[#667085]">Két tài sản &amp; cá nhân của bạn</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#344054]">Số điện thoại</label>
            <input
              type="tel"
              autoComplete="tel"
              placeholder="09xxxxxxxx"
              className="w-full rounded-xl border border-[#E4E7EC] px-4 py-3 text-base outline-none focus:border-vaultgreen"
              {...register('phone')}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#344054]">Mật khẩu</label>
            <input
              type="password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-[#E4E7EC] px-4 py-3 text-base outline-none focus:border-vaultgreen"
              {...register('password')}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          {serverError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="w-full rounded-xl bg-vaultgreen py-3.5 text-base font-bold text-white shadow-lg transition active:scale-[0.99] disabled:opacity-60"
          >
            {login.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#667085]">
          Chưa có tài khoản?{' '}
          <Link href="/vault/dang-ky" className="font-semibold text-vaultgreen">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
