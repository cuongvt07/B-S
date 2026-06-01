'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { useRegister } from '@/lib/hooks/useAuth';

const schema = z.object({
  name: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^0\d{9,10}$/, 'Số điện thoại không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});
type FormValues = z.infer<typeof schema>;

interface Props {
  onSuccess?: () => void;
  nextUrl?: string;
}

export function RegisterForm({ onSuccess, nextUrl }: Props) {
  const router = useRouter();
  const register$ = useRegister();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await register$.mutateAsync(values);
      onSuccess?.();
      router.push(nextUrl ?? '/tai-khoan');
      router.refresh();
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : 'Đăng ký thất bại');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Họ và tên"
        autoComplete="name"
        autoFocus
        {...register('name')}
        error={errors.name?.message}
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Số điện thoại"
        type="tel"
        autoComplete="tel"
        placeholder="09xxxxxxxx"
        {...register('phone')}
        error={errors.phone?.message}
      />
      <Input
        label="Mật khẩu"
        type="password"
        autoComplete="new-password"
        {...register('password')}
        error={errors.password?.message}
      />
      {serverError && (
        <p className="rounded-sm bg-danger-soft px-3 py-2 text-sm text-danger">{serverError}</p>
      )}
      <Button type="submit" fullWidth loading={isSubmitting || register$.isPending}>
        Đăng ký
      </Button>
    </form>
  );
}
