'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { UploadCloud, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select } from '@/components/ui';
import { meApi } from '@/lib/api/auth';
import { listingApi } from '@/lib/api/listings';
import { categoryApi } from '@/lib/api/categories';
import { locationApi } from '@/lib/api/locations';
import { cities as mockCities } from '@/mocks/data/cities';
import { categories as mockCategories } from '@/mocks/data/categories';
import { AMENITIES, PROPERTY_TYPE_LABELS, DIRECTION_LABELS, FURNISH_LABELS } from '@/lib/constants';
import { DEFAULT_POST_CITY_CODE, ensureDefaultPostCity } from '@/lib/constants/locationDefaults';
import { formatBytes, prepareListingImage } from '@/lib/utils/imageUpload';
import type { Listing, PropertyType, TransactionType, Direction, FurnishLevel } from '@/types';

const schema = z.object({
  transactionType: z.enum(['rent', 'sale']),
  propertyType: z.enum(['apartment', 'room', 'house', 'office', 'land', 'shared']),
  categoryId: z.string().min(1, 'Chọn danh mục'),
  title: z.string().min(5, 'Tiêu đề tối thiểu 5 ký tự').max(120, 'Tối đa 120 ký tự'),
  contactPhone: z.string().regex(/^0\d{9,10}$/, 'Số điện thoại không hợp lệ'),
  description: z.string().min(5, 'Mô tả tối thiểu 5 ký tự'),
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

type ImageUploadStatus = 'ready' | 'optimizing' | 'uploading' | 'done' | 'error';

interface ImageUploadItem {
  id: string;
  name: string;
  previewUrl: string;
  url?: string;
  role: 'primary' | 'slider';
  status: ImageUploadStatus;
  originalSize?: number;
  compressedSize?: number;
  error?: string;
  local?: boolean;
}

function formValuesFromListing(listing: Listing): FormValues {
  return {
    transactionType: listing.transactionType,
    propertyType: listing.propertyType,
    categoryId: listing.categoryId,
    title: listing.title,
    contactPhone: listing.contact.phone,
    description: listing.description,
    price: listing.price,
    priceUnit: listing.priceUnit,
    area: listing.area,
    bedrooms: listing.bedrooms,
    bathrooms: listing.bathrooms,
    direction: listing.direction ?? '',
    furnish: listing.furnish ?? '',
    cityCode: listing.cityCode,
    districtCode: listing.districtCode,
    wardName: listing.wardName ?? '',
    addressLine: listing.addressLine,
    imageUrls: listing.images.map((image) => image.url).join('\n'),
    amenities: listing.amenities,
    tags: listing.tags.join(', '),
  };
}

export function PostListingForm({ editId }: { editId?: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);
  const [imageItems, setImageItems] = useState<ImageUploadItem[]>([]);
  const imageItemsRef = useRef<ImageUploadItem[]>([]);
  const isEditing = Boolean(editId);

  const categoryQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.list(),
    retry: 1,
  });
  const cityQuery = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationApi.cities(),
    retry: 1,
  });
  const editQuery = useQuery({
    queryKey: ['listing', editId],
    queryFn: () => listingApi.get(editId as string),
    enabled: isEditing,
    retry: 1,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      transactionType: 'rent',
      propertyType: 'apartment',
      categoryId: '',
      contactPhone: '',
      priceUnit: 'month',
      cityCode: DEFAULT_POST_CITY_CODE,
      districtCode: '',
      amenities: [],
      imageUrls: '',
    },
  });

  useEffect(() => {
    if (editQuery.data?.data) {
      const values = formValuesFromListing(editQuery.data.data);
      reset(values);
      setImageItems(
        editQuery.data.data.images.map((image, index) => ({
          id: image.id,
          name: image.alt || image.url.split('/').pop() || image.id,
          previewUrl: image.url,
          url: image.url,
          role: index === 0 ? 'primary' : 'slider',
          status: 'done',
        }))
      );
    }
  }, [editQuery.data, reset]);

  useEffect(() => {
    imageItemsRef.current = imageItems;
  }, [imageItems]);

  useEffect(() => {
    return () => {
      imageItemsRef.current.forEach((item) => {
        if (item.local) URL.revokeObjectURL(item.previewUrl);
      });
    };
  }, []);

  const cities = useMemo(
    () => ensureDefaultPostCity(cityQuery.data?.data?.length ? cityQuery.data.data : mockCities),
    [cityQuery.data?.data]
  );
  const categories = categoryQuery.data?.data?.length ? categoryQuery.data.data : mockCategories;
  const cityByCode = useMemo(() => new Map(cities.map((city) => [city.code, city])), [cities]);

  const watchedCity = watch('cityCode');
  const watchedAmenities = watch('amenities');
  const watchedTransactionType = watch('transactionType');
  const districtOptions = (watchedCity ? cityByCode.get(watchedCity)?.districts : undefined) ?? [];

  const save = useMutation({
    mutationFn: (payload: Partial<Listing>) =>
      editId ? meApi.updateListing(editId, payload) : meApi.createListing(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me', 'listings'] });
      qc.invalidateQueries({ queryKey: ['listing', editId] });
    },
  });

  async function onSubmit(values: FormValues) {
    setServerError(null);
    if (imageItems.some((item) => item.status === 'optimizing' || item.status === 'uploading')) {
      setServerError('Ảnh đang upload, vui lòng đợi hoàn tất trước khi lưu tin.');
      return;
    }
    if (imageItems.some((item) => item.status === 'error')) {
      setServerError('Có ảnh upload lỗi. Vui lòng xóa ảnh lỗi hoặc upload lại.');
      return;
    }
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
      bedrooms: values.bedrooms || undefined,
      bathrooms: values.bathrooms || undefined,
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
      contact: {
        name: editQuery.data?.data.contact.name ?? '',
        phone: values.contactPhone,
      },
    };

    try {
      await save.mutateAsync(payload);
      router.push('/tai-khoan/tin-cua-toi');
      router.refresh();
    } catch (e: unknown) {
      setServerError(e instanceof Error ? e.message : isEditing ? 'Cập nhật tin thất bại' : 'Đăng tin thất bại');
    }
  }

  function toggleAmenity(value: string) {
    const cur = watchedAmenities ?? [];
    setValue('amenities', cur.includes(value) ? cur.filter((a) => a !== value) : [...cur, value]);
  }

  async function handleImageFiles(files: FileList | null, mode: 'primary' | 'slider' = 'slider') {
    if (!files?.length) return;
    setServerError(null);

    const selected = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, mode === 'primary' ? 1 : Math.max(0, 30 - imageItems.length));

    if (!selected.length) return;

    const pendingItems: ImageUploadItem[] = selected.map((file) => ({
      id: `${Date.now()}-${file.name}-${Math.random().toString(16).slice(2)}`,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      role: mode,
      status: 'optimizing',
      originalSize: file.size,
      local: true,
    }));

    setImageItems((prev) => {
      if (mode === 'primary') {
        const removedPrimary = prev.find((item) => item.role === 'primary');
        if (removedPrimary?.local) URL.revokeObjectURL(removedPrimary.previewUrl);
        const next = [pendingItems[0], ...prev.filter((item) => item.role !== 'primary')];
        syncImageUrls(next);
        return next;
      }

      const next = [...prev, ...pendingItems];
      syncImageUrls(next);
      return next;
    });

    try {
      const prepared = await Promise.all(selected.map((file) => prepareListingImage(file)));
      const preparedByName = new Map(prepared.map((item, index) => [pendingItems[index].id, item]));

      setImageItems((prev) =>
        prev.map((item) => {
          const preparedItem = preparedByName.get(item.id);
          if (!preparedItem) return item;
          return {
            ...item,
            status: 'uploading',
            originalSize: preparedItem.originalSize,
            compressedSize: preparedItem.compressedSize,
          };
        })
      );

      const uploaded = await meApi.uploadListingImages(prepared.map((item) => item.file));
      const uploadedById = new Map(uploaded.data.map((item, index) => [pendingItems[index].id, item]));

      setImageItems((prev) => {
        const next = prev.map((item) => {
          const uploadedItem = uploadedById.get(item.id);
          if (!uploadedItem) return item;
          return {
            ...item,
            status: 'done' as ImageUploadStatus,
            url: uploadedItem.url,
            name: uploadedItem.name || item.name,
          };
        });
        syncImageUrls(next);
        return next;
      });
    } catch (error) {
      setImageItems((prev) =>
        prev.map((item) =>
          pendingItems.some((pending) => pending.id === item.id)
            ? {
                ...item,
                status: 'error',
                error: error instanceof Error ? error.message : 'Upload thất bại',
              }
            : item
        )
      );
    }
  }

  function removeImage(id: string) {
    setImageItems((prev) => {
      const removed = prev.find((item) => item.id === id);
      if (removed?.local) URL.revokeObjectURL(removed.previewUrl);
      const next = prev.filter((item) => item.id !== id);
      syncImageUrls(next);
      return next;
    });
  }

  function syncImageUrls(items: ImageUploadItem[]) {
    const orderedItems = [
      ...items.filter((item) => item.role === 'primary'),
      ...items.filter((item) => item.role === 'slider'),
    ];
    const urls = orderedItems
      .map((item) => item.url)
      .filter((url): url is string => Boolean(url));
    setValue('imageUrls', urls.join('\n'), { shouldValidate: true });
  }

  const filteredCategories = categories.filter((c) =>
    c.transactionType === 'both' || c.transactionType === watchedTransactionType
  );
  const primaryImage = imageItems.find((item) => item.role === 'primary');
  const sliderImages = imageItems.filter((item) => item.role === 'slider');

  if (editQuery.isLoading) {
    return (
      <div className="rounded-md border border-brdr bg-white p-6 text-sm text-ink-muted">
        Đang tải dữ liệu tin đăng...
      </div>
    );
  }

  if (isEditing && editQuery.isError) {
    return (
      <div className="rounded-md border border-danger bg-danger-soft p-4 text-sm text-danger">
        Không tải được tin đăng cần sửa. Vui lòng kiểm tra đăng nhập và thử lại.
      </div>
    );
  }

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

      <Section title="2. Tiêu đề và mô tả">
        <Input
          label="Tiêu đề tin"
          placeholder="VD: Căn hộ 2PN Vinhomes Central Park view sông, full nội thất"
          {...register('title')}
          error={errors.title?.message}
        />
        <Input
          label="Số liên hệ"
          type="tel"
          placeholder="09xxxxxxxx"
          autoComplete="tel"
          {...register('contactPhone')}
          error={errors.contactPhone?.message}
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

      <Section title="3. Giá và diện tích">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Giá (VND)"
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
            label="Diện tích (m2)"
            type="number"
            {...register('area')}
            error={errors.area?.message}
          />
          <Input label="Phòng ngủ" type="number" {...register('bedrooms')} />
          <Input label="Phòng tắm" type="number" {...register('bathrooms')} />
          <Select
            label="Hướng"
            options={[
              { value: '', label: 'Không xác định' },
              ...Object.entries(DIRECTION_LABELS).map(([v, l]) => ({ value: v, label: l })),
            ]}
            {...register('direction')}
          />
          <Select
            label="Nội thất"
            options={[
              { value: '', label: 'Không xác định' },
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
          <Input label="Phường / Xã (tùy chọn)" {...register('wardName')} />
          <Input
            label="Địa chỉ chi tiết"
            placeholder="Số nhà, đường"
            {...register('addressLine')}
            error={errors.addressLine?.message}
          />
        </div>
      </Section>

      <Section title="5. Hình ảnh và tiện ích">
        <input type="hidden" {...register('imageUrls')} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div>
            <label className="mb-2 block text-sm font-semibold">Ảnh chính</label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-brdr bg-surface-subtle px-4 py-6 text-center transition hover:border-primary hover:bg-primary/5">
              <UploadCloud size={28} className="text-primary" />
              <span className="mt-2 text-sm font-semibold text-ink">Chọn ảnh chính</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                className="sr-only"
                onChange={(e) => {
                  void handleImageFiles(e.target.files, 'primary');
                  e.target.value = '';
                }}
              />
            </label>
            {primaryImage && (
              <div className="mt-3">
                <ImageUploadCard item={primaryImage} badge="Ảnh chính" onRemove={() => removeImage(primaryImage.id)} />
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">Ảnh slider</label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-brdr bg-surface-subtle px-4 py-6 text-center transition hover:border-primary hover:bg-primary/5">
              <UploadCloud size={28} className="text-primary" />
              <span className="mt-2 text-sm font-semibold text-ink">Chọn ảnh slider</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                multiple
                className="sr-only"
                onChange={(e) => {
                  void handleImageFiles(e.target.files, 'slider');
                  e.target.value = '';
                }}
              />
            </label>
            {sliderImages.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {sliderImages.map((item) => (
                  <ImageUploadCard key={item.id} item={item} onRemove={() => removeImage(item.id)} />
                ))}
              </div>
            )}
          </div>
        </div>
        {errors.imageUrls && <p className="text-xs text-danger">{errors.imageUrls.message}</p>}
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
          Hủy
        </Button>
        <Button type="submit" loading={isSubmitting || save.isPending}>
          {isEditing ? 'Cập nhật tin' : 'Đăng tin'}
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

function ImageUploadCard({
  item,
  badge,
  onRemove,
}: {
  item: ImageUploadItem;
  badge?: string;
  onRemove: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-md border border-brdr bg-white">
      <div className="relative aspect-[4/3] bg-surface-subtle">
        {/* eslint-disable-next-line @next/next/no-img-element -- local blob previews are not served through Next Image */}
        <img
          src={item.previewUrl}
          alt={item.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white hover:bg-danger"
          aria-label="Xóa ảnh"
        >
          <X size={14} />
        </button>
        {badge && item.status === 'done' && (
          <span className="absolute left-1.5 top-1.5 rounded-sm bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            {badge}
          </span>
        )}
      </div>
      <div className="space-y-1 p-2 text-xs">
        <p className="truncate font-semibold text-ink">{item.name}</p>
        <div className="flex items-center justify-between gap-2 text-[11px] text-ink-muted">
          <span>
            {item.compressedSize && item.originalSize
              ? `${formatBytes(item.originalSize)} -> ${formatBytes(item.compressedSize)}`
              : item.originalSize
                ? formatBytes(item.originalSize)
                : 'URL'}
          </span>
          <ImageStatus status={item.status} />
        </div>
        {item.error && <p className="line-clamp-2 text-[11px] text-danger">{item.error}</p>}
      </div>
    </div>
  );
}

function ImageStatus({ status }: { status: ImageUploadStatus }) {
  const labels: Record<ImageUploadStatus, string> = {
    ready: 'Sẵn sàng',
    optimizing: 'Đang nén',
    uploading: 'Đang upload',
    done: 'Xong',
    error: 'Lỗi',
  };

  return (
    <span
      className={
        status === 'done'
          ? 'font-semibold text-price'
          : status === 'error'
            ? 'font-semibold text-danger'
            : 'font-semibold text-primary'
      }
    >
      {labels[status]}
    </span>
  );
}
