'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UploadCloud, X } from '@/components/icons';
import { Button, Card, Input } from '@/components/ui';
import { apiFetch } from '@/lib/api/client';
import { meApi } from '@/lib/api/auth';
import { formatBytes, prepareListingImage } from '@/lib/utils/imageUpload';
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
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl ?? '');
  const [avatarUploadMsg, setAvatarUploadMsg] = useState<string | null>(null);
  const [avatarUploadErr, setAvatarUploadErr] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

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

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  async function handleAvatarFile(file: File | undefined) {
    setAvatarUploadErr(null);
    setAvatarUploadMsg(null);
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setAvatarUploadErr('Vui lòng chọn file ảnh hợp lệ.');
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setAvatarPreview((prev) => {
      if (prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return localPreview;
    });
    setIsUploadingAvatar(true);

    try {
      const prepared = await prepareListingImage(file);
      setAvatarUploadMsg(
        prepared.compressedSize < prepared.originalSize
          ? `Đã nén ${formatBytes(prepared.originalSize)} -> ${formatBytes(prepared.compressedSize)}, đang upload...`
          : 'Đang upload ảnh...'
      );
      const uploaded = await meApi.uploadListingImages([prepared.file]);
      const url = uploaded.data[0]?.url;
      if (!url) throw new Error('Upload ảnh không trả về URL.');

      setAvatarPreview((prev) => {
        if (prev.startsWith('blob:')) URL.revokeObjectURL(prev);
        return url;
      });
      profileForm.setValue('avatarUrl', url, { shouldDirty: true, shouldValidate: true });
      setAvatarUploadMsg('Đã chọn ảnh đại diện mới.');
    } catch (error) {
      setAvatarPreview((prev) => {
        if (prev.startsWith('blob:')) URL.revokeObjectURL(prev);
        return profileForm.getValues('avatarUrl') || '';
      });
      setAvatarUploadErr(error instanceof Error ? error.message : 'Upload ảnh thất bại.');
      setAvatarUploadMsg(null);
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  function clearAvatar() {
    setAvatarPreview((prev) => {
      if (prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return '';
    });
    profileForm.setValue('avatarUrl', '', { shouldDirty: true, shouldValidate: true });
    setAvatarUploadMsg(null);
    setAvatarUploadErr(null);
  }

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
          <input type="hidden" {...profileForm.register('avatarUrl')} />
          <div>
            <label className="mb-2 block text-sm font-semibold">Ảnh đại diện</label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-brdr bg-surface-subtle">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element -- blob previews cannot go through next/image
                  <img src={avatarPreview} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-xl font-semibold text-ink-muted">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <label className="inline-flex min-h-[40px] cursor-pointer items-center justify-center gap-2 rounded-sm border border-brdr px-3 py-2 text-sm font-semibold text-ink transition hover:bg-surface-subtle">
                    <UploadCloud size={16} />
                    {isUploadingAvatar ? 'Đang upload...' : 'Chọn ảnh'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                      className="sr-only"
                      disabled={isUploadingAvatar || profileMutation.isPending}
                      onChange={(e) => {
                        void handleAvatarFile(e.target.files?.[0]);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {avatarPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      leftIcon={<X size={14} />}
                      onClick={clearAvatar}
                      disabled={isUploadingAvatar || profileMutation.isPending}
                    >
                      Xóa ảnh
                    </Button>
                  )}
                </div>
                {avatarUploadMsg && <p className="text-xs text-price">{avatarUploadMsg}</p>}
                {avatarUploadErr && <p className="text-xs text-danger">{avatarUploadErr}</p>}
                {profileForm.formState.errors.avatarUrl && (
                  <p className="text-xs text-danger">{profileForm.formState.errors.avatarUrl.message}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" loading={profileMutation.isPending} disabled={isUploadingAvatar}>
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
