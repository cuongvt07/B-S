'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import type { Listing, PropertyType, TransactionType, Direction, FurnishLevel } from '@/types';

const schema = z.object({
  transactionType: z.enum(['rent', 'sale']),
  propertyType: z.enum(['apartment', 'room', 'house', 'office', 'land', 'shared']),
  categoryId: z.string().min(1, 'Chon danh muc'),
  title: z.string().min(15, 'Tieu de toi thieu 15 ky tu').max(120, 'Toi da 120 ky tu'),
  contactPhone: z.string().regex(/^0\d{9,10}$/, 'So dien thoai khong hop le'),
  description: z.string().min(50, 'Mo ta toi thieu 50 ky tu'),
  price: z.coerce.number().positive('Gia phai lon hon 0'),
  priceUnit: z.enum(['month', 'total']),
  area: z.coerce.number().positive('Dien tich phai lon hon 0'),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  direction: z.enum(['east', 'west', 'south', 'north', 'ne', 'nw', 'se', 'sw']).optional().or(z.literal('')),
  furnish: z.enum(['none', 'basic', 'full']).optional().or(z.literal('')),
  cityCode: z.string().min(1, 'Chon tinh / thanh pho'),
  districtCode: z.string().min(1, 'Chon quan / huyen'),
  wardName: z.string().optional(),
  addressLine: z.string().min(5, 'Dia chi toi thieu 5 ky tu'),
  imageUrls: z.string().min(1, 'Can it nhat 1 anh').default(''),
  amenities: z.array(z.string()).default([]),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

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
      cityCode: '',
      districtCode: '',
      amenities: [],
      imageUrls: '',
    },
  });

  useEffect(() => {
    if (editQuery.data?.data) {
      reset(formValuesFromListing(editQuery.data.data));
    }
  }, [editQuery.data, reset]);

  const cities = cityQuery.data?.data?.length ? cityQuery.data.data : mockCities;
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
      setServerError(e instanceof Error ? e.message : isEditing ? 'Cap nhat tin that bai' : 'Dang tin that bai');
    }
  }

  function toggleAmenity(value: string) {
    const cur = watchedAmenities ?? [];
    setValue('amenities', cur.includes(value) ? cur.filter((a) => a !== value) : [...cur, value]);
  }

  const filteredCategories = categories.filter((c) =>
    c.transactionType === 'both' || c.transactionType === watchedTransactionType
  );

  if (editQuery.isLoading) {
    return (
      <div className="rounded-md border border-brdr bg-white p-6 text-sm text-ink-muted">
        Dang tai du lieu tin dang...
      </div>
    );
  }

  if (isEditing && editQuery.isError) {
    return (
      <div className="rounded-md border border-danger bg-danger-soft p-4 text-sm text-danger">
        Khong tai duoc tin dang can sua. Vui long kiem tra dang nhap va thu lai.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Section title="1. Thong tin co ban">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Loai giao dich"
            options={[
              { value: 'rent', label: 'Cho thue' },
              { value: 'sale', label: 'Mua ban' },
            ]}
            {...register('transactionType')}
            error={errors.transactionType?.message}
          />
          <Select
            label="Loai bat dong san"
            options={Object.entries(PROPERTY_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
            {...register('propertyType')}
            error={errors.propertyType?.message}
          />
          <Select
            label="Danh muc"
            options={filteredCategories.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="Chon danh muc"
            {...register('categoryId')}
            error={errors.categoryId?.message}
          />
        </div>
      </Section>

      <Section title="2. Tieu de va mo ta">
        <Input
          label="Tieu de tin"
          placeholder="VD: Can ho 2PN Vinhomes Central Park view song, full noi that"
          {...register('title')}
          error={errors.title?.message}
        />
        <Input
          label="So lien he"
          type="tel"
          placeholder="09xxxxxxxx"
          autoComplete="tel"
          {...register('contactPhone')}
          error={errors.contactPhone?.message}
        />
        <div>
          <label className="mb-1 block text-sm font-semibold">Mo ta chi tiet</label>
          <textarea
            rows={6}
            className="w-full rounded-sm border border-brdr px-3 py-2 text-sm focus:outline-none focus:border-primary"
            placeholder="Mo ta chi tiet ve can ho, tien ich, vi tri..."
            {...register('description')}
          />
          {errors.description && <p className="mt-1 text-xs text-danger">{errors.description.message}</p>}
        </div>
      </Section>

      <Section title="3. Gia va dien tich">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Gia (VND)"
            type="number"
            placeholder="VD: 5000000"
            {...register('price')}
            error={errors.price?.message}
          />
          <Select
            label="Don vi gia"
            options={[
              { value: 'month', label: '/ thang' },
              { value: 'total', label: 'Tong gia' },
            ]}
            {...register('priceUnit')}
          />
          <Input
            label="Dien tich (m2)"
            type="number"
            {...register('area')}
            error={errors.area?.message}
          />
          <Input label="Phong ngu" type="number" {...register('bedrooms')} />
          <Input label="Phong tam" type="number" {...register('bathrooms')} />
          <Select
            label="Huong"
            options={[
              { value: '', label: 'Khong xac dinh' },
              ...Object.entries(DIRECTION_LABELS).map(([v, l]) => ({ value: v, label: l })),
            ]}
            {...register('direction')}
          />
          <Select
            label="Noi that"
            options={[
              { value: '', label: 'Khong xac dinh' },
              ...Object.entries(FURNISH_LABELS).map(([v, l]) => ({ value: v, label: l })),
            ]}
            {...register('furnish')}
          />
        </div>
      </Section>

      <Section title="4. Vi tri">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Tinh / Thanh pho"
            options={cities.map((c) => ({ value: c.code, label: c.name }))}
            placeholder="Chon tinh / thanh"
            {...register('cityCode')}
            error={errors.cityCode?.message}
          />
          <Select
            label="Quan / Huyen"
            options={districtOptions.map((d) => ({ value: d.code, label: d.name }))}
            placeholder="Chon quan / huyen"
            {...register('districtCode')}
            error={errors.districtCode?.message}
          />
          <Input label="Phuong / Xa (tuy chon)" {...register('wardName')} />
          <Input
            label="Dia chi chi tiet"
            placeholder="So nha, duong"
            {...register('addressLine')}
            error={errors.addressLine?.message}
          />
        </div>
      </Section>

      <Section title="5. Hinh anh va tien ich">
        <div>
          <label className="mb-1 block text-sm font-semibold">URL hinh anh (moi URL 1 dong)</label>
          <textarea
            rows={3}
            className="w-full rounded-sm border border-brdr px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary"
            placeholder="https://images.unsplash.com/photo-..."
            {...register('imageUrls')}
          />
          {errors.imageUrls && <p className="mt-1 text-xs text-danger">{errors.imageUrls.message}</p>}
          <p className="mt-1 text-xs text-ink-muted">
            Tam thoi dung URL public; API upload file rieng co the bo sung sau khi BE co storage endpoint.
          </p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold">Tien ich</label>
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
          label="Tags (cach nhau dau phay)"
          placeholder="VD: view song, full noi that, tang cao"
          {...register('tags')}
        />
      </Section>

      {serverError && (
        <p className="rounded-sm bg-danger-soft px-3 py-2 text-sm text-danger">{serverError}</p>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Huy
        </Button>
        <Button type="submit" loading={isSubmitting || save.isPending}>
          {isEditing ? 'Cap nhat tin' : 'Dang tin'}
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
