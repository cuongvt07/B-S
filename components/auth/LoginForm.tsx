'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { useLogin } from '@/lib/hooks/useAuth';

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});
type FormValues = z.infer<typeof schema>;

interface Props {
  onSuccess?: () => void;
  nextUrl?: string;
}

export function LoginForm({ onSuccess, nextUrl }: Props) {
  const router = useRouter();
  const login = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      await login.mutateAsync(values);
      onSuccess?.();
      if (nextUrl) {
        router.push(nextUrl);
      }
      router.refresh();
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : 'Đăng nhập thất bại');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="rounded-sm bg-surface-subtle px-3 py-2 text-xs text-ink-muted">
        Tài khoản demo:{' '}
        <code className="rounded-sm bg-white px-1 font-mono">an.nguyen@example.com</code> /{' '}
        <code className="rounded-sm bg-white px-1 font-mono">123456</code>
      </p>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        autoFocus
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Mật khẩu"
        type="password"
        autoComplete="current-password"
        {...register('password')}
        error={errors.password?.message}
      />
      {serverError && (
        <p className="rounded-sm bg-danger-soft px-3 py-2 text-sm text-danger">{serverError}</p>
      )}
      <Button type="submit" fullWidth loading={isSubmitting || login.isPending}>
        Đăng nhập
      </Button>
    </form>
  );
}
