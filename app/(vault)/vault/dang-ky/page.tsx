'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useVaultRegister } from '@/lib/vault/useVaultAuth';
import { VaultApiError } from '@/lib/vault/vaultClient';

const schema = z.object({
  name: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
  phone: z.string().regex(/^0\d{9,10}$/, 'Số điện thoại không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  referralCode: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function VaultRegisterPage() {
  return (
    <Suspense fallback={null}>
      <VaultRegisterForm />
    </Suspense>
  );
}

function VaultRegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const register_ = useVaultRegister();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { referralCode: searchParams.get('ref') ?? '' },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await register_.mutateAsync(values);
      router.replace('/vault');
    } catch (e) {
      setServerError(e instanceof VaultApiError ? e.message : 'Đăng ký thất bại, thử lại sau');
    }
  }

  return (
    <div className="flex min-h-screen sm:min-h-full flex-col justify-center px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-vaultgreen text-2xl font-black text-white shadow-lg">
            V
          </div>
          <h1 className="text-2xl font-bold text-[#0B1220]">Tạo tài khoản Vault</h1>
          <p className="mt-1 text-sm text-[#667085]">Bắt đầu tích lũy sinh lời ngay hôm nay</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#344054]">Họ và tên</label>
            <input
              className="w-full rounded-xl border border-[#E4E7EC] px-4 py-3 text-base outline-none focus:border-vaultgreen"
              {...register('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

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
              autoComplete="new-password"
              className="w-full rounded-xl border border-[#E4E7EC] px-4 py-3 text-base outline-none focus:border-vaultgreen"
              {...register('password')}
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#344054]">
              Mã giới thiệu <span className="font-normal text-[#98A2B3]">(không bắt buộc)</span>
            </label>
            <input
              className="w-full rounded-xl border border-[#E4E7EC] px-4 py-3 text-base uppercase outline-none focus:border-vaultgreen"
              {...register('referralCode')}
            />
          </div>

          {serverError && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={register_.isPending}
            className="w-full rounded-xl bg-vaultgreen py-3.5 text-base font-bold text-white shadow-lg transition active:scale-[0.99] disabled:opacity-60"
          >
            {register_.isPending ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#667085]">
          Đã có tài khoản?{' '}
          <Link href="/vault/dang-nhap" className="font-semibold text-vaultgreen">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
