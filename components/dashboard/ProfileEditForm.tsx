'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Input } from '@/components/ui';
import { apiFetch } from '@/lib/api/client';
import type { User } from '@/types';

const profileSchema = z.object({
  name: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
  phone: z.string().regex(/^0\d{9,10}$/, 'Số điện thoại không hợp lệ'),
  avatarUrl: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
});
type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Tối thiểu 6 ký tự'),
    newPassword: z.string().min(6, 'Tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(6, 'Tối thiểu 6 ký tự'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });
type PasswordValues = z.infer<typeof passwordSchema>;

export function ProfileEditForm({ user }: { user: User }) {
  const qc = useQueryClient();
  const [profileMsg, setProfileMsg] = useState<string | null>(null);
  const [pwdMsg, setPwdMsg] = useState<string | null>(null);
  const [pwdErr, setPwdErr] = useState<string | null>(null);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone,
      avatarUrl: user.avatarUrl ?? '',
    },
  });

  const profileMutation = useMutation({
    mutationFn: (values: ProfileValues) =>
      apiFetch<{ data: User }>('/me', { method: 'PUT', body: JSON.stringify(values) }),
    onSuccess: () => {
      setProfileMsg('Đã cập nhật thông tin');
      qc.invalidateQueries({ queryKey: ['me'] });
      setTimeout(() => setProfileMsg(null), 2500);
    },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
  });

  const passwordMutation = useMutation({
    mutationFn: (values: { currentPassword: string; newPassword: string }) =>
      apiFetch<{ data: { ok: boolean } }>('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      setPwdMsg('Đã đổi mật khẩu thành công');
      setPwdErr(null);
      passwordForm.reset();
      setTimeout(() => setPwdMsg(null), 2500);
    },
    onError: (err: unknown) => {
      setPwdErr(err instanceof Error ? err.message : 'Đổi mật khẩu thất bại');
      setPwdMsg(null);
    },
  });

  return (
    <div className="space-y-6">
      <Card padded className="!p-6">
        <h2 className="mb-4 text-lg font-semibold text-ink">Thông tin cá nhân</h2>
        <form
          onSubmit={profileForm.handleSubmit((v) => profileMutation.mutate(v))}
          className="space-y-4"
        >
          <Input
            label="Họ tên"
            {...profileForm.register('name')}
            error={profileForm.formState.errors.name?.message}
          />
          <Input label="Email" value={user.email} disabled />
          <Input
            label="Số điện thoại"
            {...profileForm.register('phone')}
            error={profileForm.formState.errors.phone?.message}
          />
          <Input
            label="URL ảnh đại diện (tuỳ chọn)"
            placeholder="https://..."
            {...profileForm.register('avatarUrl')}
            error={profileForm.formState.errors.avatarUrl?.message}
          />
          <div className="flex items-center gap-3">
            <Button type="submit" loading={profileMutation.isPending}>
              Lưu thay đổi
            </Button>
            {profileMsg && <span className="text-sm text-price">{profileMsg}</span>}
          </div>
        </form>
      </Card>

      <Card padded className="!p-6">
        <h2 className="mb-4 text-lg font-semibold text-ink">Đổi mật khẩu</h2>
        <form
          onSubmit={passwordForm.handleSubmit((v) =>
            passwordMutation.mutate({ currentPassword: v.currentPassword, newPassword: v.newPassword })
          )}
          className="space-y-4"
        >
          <Input
            label="Mật khẩu hiện tại"
            type="password"
            {...passwordForm.register('currentPassword')}
            error={passwordForm.formState.errors.currentPassword?.message}
          />
          <Input
            label="Mật khẩu mới"
            type="password"
            {...passwordForm.register('newPassword')}
            error={passwordForm.formState.errors.newPassword?.message}
          />
          <Input
            label="Xác nhận mật khẩu mới"
            type="password"
            {...passwordForm.register('confirmPassword')}
            error={passwordForm.formState.errors.confirmPassword?.message}
          />
          <p className="text-xs text-ink-muted">Mật khẩu hiện tại trong demo: 123456</p>
          <div className="flex items-center gap-3">
            <Button type="submit" loading={passwordMutation.isPending}>
              Đổi mật khẩu
            </Button>
            {pwdMsg && <span className="text-sm text-price">{pwdMsg}</span>}
            {pwdErr && <span className="text-sm text-danger">{pwdErr}</span>}
          </div>
        </form>
      </Card>
    </div>
  );
}
