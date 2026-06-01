'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select } from '@/components/ui';
import { meApi } from '@/lib/api/auth';
import { cities, cityByCode } from '@/mocks/data/cities';
import { categories } from '@/mocks/data/categories';
import { AMENITIES, PROPERTY_TYPE_LABELS, DIRECTION_LABELS, FURNISH_LABELS } from '@/lib/constants';
import type { Listing, PropertyType, TransactionType, Direction, FurnishLevel } from '@/types';

const schema = z.object({
  transactionType: z.enum(['rent', 'sale']),
  propertyType: z.enum(['apartment', 'room', 'house', 'office', 'land', 'shared']),
  categoryId: z.string().min(1, 'Chọn danh mục'),
  title: z.string().min(15, 'Tiêu đề tối thiểu 15 ký tự').max(120, 'Tối đa 120 ký tự'),
  description: z.string().min(50, 'Mô tả tối thiểu 50 ký tự'),
  price: z.coerce.number().positive('Giá phải lớn hơn 0'),
  priceUnit: z.enum(['month', 'total']),
  area: z.coerce.number().positive('Diện tích phải lớn hơn 0'),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  direction: z.enum(['east', 'west', 'south', 'north', 'ne', 'nw', 'se', 'sw']).optional().or(z.literal('')),
  furnish: z.enum(['none', 'basic', 'full']).optional().or(z.literal('')),
  cityCode: z.string().min(1, 'Chọn tỉnh / thành phố'),
  districtCode: z.string().min(1, 'Chọn quận / huyện'),
  wardName: z.string().optional(),
  addressLine: z.string().min(5, 'Địa chỉ tối thiểu 5 ký tự'),
  imageUrls: z.string().min(1, 'Cần ít nhất 1 ảnh').default(''),
  amenities: z.array(z.string()).default([]),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function PostListingForm() {
  const router = useRouter();
  const qc = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      transactionType: 'rent',
      propertyType: 'apartment',
      categoryId: '',
      priceUnit: 'month',
      cityCode: '',
      districtCode: '',
      amenities: [],
      imageUrls: '',
    },
  });

  const watchedCity = watch('cityCode');
  const watchedAmenities = watch('amenities');
  const districtOptions = (watchedCity ? cityByCode.get(watchedCity)?.districts : undefined) ?? [];

  const create = useMutation({
    mutationFn: (payload: Partial<Listing>) => meApi.createListing(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me', 'listings'] });
    },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const imageUrls = values.imageUrls
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);
    const tags = (values.tags ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Partial<Listing> = {
      transactionType: values.transactionType as TransactionType,
      propertyType: values.propertyType as PropertyType,
      categoryId: values.categoryId,
      title: values.title,
      description: values.description,
      price: values.price,
      priceUnit: values.priceUnit,
      area: values.area,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      direction: (values.direction || undefined) as Direction | undefined,
      furnish: (values.furnish || undefined) as FurnishLevel | undefined,
      cityCode: values.cityCode,
      districtCode: values.districtCode,
      wardName: values.wardName,
      addressLine: values.addressLine,
      images: imageUrls.map((url, i) => ({
        id: `img-${i}`,
        url,
        isPrimary: i === 0,
      })),
      amenities: values.amenities,
      tags,
    };

    try {
      await create.mutateAsync(payload);
      router.push('/tai-khoan/tin-cua-toi');
      router.refresh();
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : 'Đăng tin thất bại');
    }
  }

  function toggleAmenity(value: string) {
    const cur = watchedAmenities ?? [];
    setValue('amenities', cur.includes(value) ? cur.filter((a) => a !== value) : [...cur, value]);
  }

  const filteredCategories = categories.filter((c) =>
    c.transactionType === 'both' || c.transactionType === watch('transactionType')
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Section title="1. Thông tin cơ bản">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Loại giao dịch"
            options={[
              { value: 'rent', label: 'Cho thuê' },
              { value: 'sale', label: 'Mua bán' },
            ]}
            {...register('transactionType')}
            error={errors.transactionType?.message}
          />
          <Select
            label="Loại bất động sản"
            options={Object.entries(PROPERTY_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
            {...register('propertyType')}
            error={errors.propertyType?.message}
          />
          <Select
            label="Danh mục"
            options={filteredCategories.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Chọn danh mục"
            {...register('categoryId')}
            error={errors.categoryId?.message}
          />
        </div>
      </Section>

      <Section title="2. Tiêu đề & mô tả">
        <Input
          label="Tiêu đề tin"
          placeholder="VD: Căn hộ 2PN Vinhomes Central Park view sông, full nội thất"
          {...register('title')}
          error={errors.title?.message}
        />
        <div>
          <label className="mb-1 block text-sm font-semibold">Mô tả chi tiết</label>
          <textarea
            rows={6}
            className="w-full rounded-sm border border-brdr px-3 py-2 text-sm focus:outline-none focus:border-primary"
            placeholder="Mô tả chi tiết về căn hộ, tiện ích, vị trí..."
            {...register('description')}
          />
          {errors.description && <p className="mt-1 text-xs text-danger">{errors.description.message}</p>}
        </div>
      </Section>

      <Section title="3. Giá & diện tích">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Giá (VNĐ)"
            type="number"
            placeholder="VD: 5000000"
            {...register('price')}
            error={errors.price?.message}
          />
          <Select
            label="Đơn vị giá"
            options={[
              { value: 'month', label: '/ tháng' },
              { value: 'total', label: 'Tổng giá' },
            ]}
            {...register('priceUnit')}
          />
          <Input
            label="Diện tích (m²)"
            type="number"
            {...register('area')}
            error={errors.area?.message}
          />
          <Input label="Phòng ngủ" type="number" {...register('bedrooms')} />
          <Input label="Phòng tắm" type="number" {...register('bathrooms')} />
          <Select
            label="Hướng"
            options={[
              { value: '', label: '— Không xác định —' },
              ...Object.entries(DIRECTION_LABELS).map(([v, l]) => ({ value: v, label: l })),
            ]}
            {...register('direction')}
          />
          <Select
            label="Nội thất"
            options={[
              { value: '', label: '— Không xác định —' },
              ...Object.entries(FURNISH_LABELS).map(([v, l]) => ({ value: v, label: l })),
            ]}
            {...register('furnish')}
          />
        </div>
      </Section>

      <Section title="4. Vị trí">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Tỉnh / Thành phố"
            options={cities.map((c) => ({ value: c.code, label: c.name }))}
            placeholder="Chọn tỉnh / thành"
            {...register('cityCode')}
            error={errors.cityCode?.message}
          />
          <Select
            label="Quận / Huyện"
            options={districtOptions.map((d) => ({ value: d.code, label: d.name }))}
            placeholder="Chọn quận / huyện"
            {...register('districtCode')}
            error={errors.districtCode?.message}
          />
          <Input label="Phường / Xã (tuỳ chọn)" {...register('wardName')} />
          <Input
            label="Địa chỉ chi tiết"
            placeholder="Số nhà, đường"
            {...register('addressLine')}
            error={errors.addressLine?.message}
          />
        </div>
      </Section>

      <Section title="5. Hình ảnh & tiện ích">
        <div>
          <label className="mb-1 block text-sm font-semibold">URL hình ảnh (mỗi URL 1 dòng)</label>
          <textarea
            rows={3}
            className="w-full rounded-sm border border-brdr px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary"
            placeholder="https://images.unsplash.com/photo-..."
            {...register('imageUrls')}
          />
          {errors.imageUrls && <p className="mt-1 text-xs text-danger">{errors.imageUrls.message}</p>}
          <p className="mt-1 text-xs text-ink-muted">
            Demo: dùng link Unsplash hoặc bất kỳ URL public nào.
          </p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">Tiện ích</label>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((a) => {
              const active = watchedAmenities?.includes(a.value);
              return (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => toggleAmenity(a.value)}
                  className={`rounded-sm border px-3 py-1 text-xs ${
                    active ? 'border-primary bg-primary/5 text-primary' : 'border-brdr text-ink'
                  }`}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>
        <Input
          label="Tags (cách nhau dấu phẩy)"
          placeholder="VD: view sông, full nội thất, tầng cao"
          {...register('tags')}
        />
      </Section>

      {serverError && (
        <p className="rounded-sm bg-danger-soft px-3 py-2 text-sm text-danger">{serverError}</p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Huỷ
        </Button>
        <Button type="submit" loading={isSubmitting || create.isPending}>
          Đăng tin
        </Button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-md border border-brdr bg-white p-4">
      <h2 className="mb-4 text-base font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
