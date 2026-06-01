'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { useLogin } from '@/lib/hooks/useAuth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^0\d{9,10}$/;

const schema = z.object({
  identifier: z
    .string()
    .min(6, 'Vui lòng nhập email hoặc số điện thoại')
    .refine((v) => EMAIL_RE.test(v) || PHONE_RE.test(v), {
      message: 'Email hoặc số điện thoại không hợp lệ',
    }),
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
    const id = values.identifier.trim();
    const isEmail = EMAIL_RE.test(id);
    try {
      await login.mutateAsync({
        password: values.password,
        ...(isEmail ? { email: id } : { phone: id }),
      });
      onSuccess?.();
      if (nextUrl) router.push(nextUrl);
      router.refresh();
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : 'Đăng nhập thất bại');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="rounded-sm bg-surface-subtle px-3 py-2 text-xs text-ink-muted">
        Đăng nhập bằng <strong className="text-ink">email</strong> hoặc{' '}
        <strong className="text-ink">số điện thoại</strong>. Admin demo:{' '}
        <code className="rounded-sm bg-white px-1 font-mono">0981847977</code>
      </p>
      <Input
        label="Email hoặc số điện thoại"
        type="text"
        autoComplete="username"
        autoFocus
        placeholder="vd: 0981847977 / your@email.com"
        {...register('identifier')}
        error={errors.identifier?.message}
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
