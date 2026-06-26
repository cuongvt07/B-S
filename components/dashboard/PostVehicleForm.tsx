'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UploadCloud, X } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { meApi } from '@/lib/api/auth';
import { vehicleApi, type VehicleInput } from '@/lib/api/vehicles';
import { prepareListingImage } from '@/lib/utils/imageUpload';
import { cities } from '@/mocks/data/cities';
import {
  VEHICLE_TYPE_LABELS,
  TRANSMISSION_LABELS,
  FUEL_LABELS,
  CONDITION_LABELS,
  ORIGIN_LABELS,
  CAR_BRANDS,
  MOTORBIKE_BRANDS,
} from '@/lib/constants';

// Chuỗi rỗng → undefined trước khi coerce, để field số optional không bị ép thành 0.
const optionalNum = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : v),
  z.coerce.number().optional()
);

const schema = z.object({
  vehicleType: z.enum(['car', 'motorbike']),
  title: z.string().min(5, 'Tiêu đề tối thiểu 5 ký tự').max(255),
  brand: z.string().optional(),
  modelName: z.string().optional(),
  year: optionalNum,
  mileage: optionalNum,
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  engineCapacity: z.string().optional(),
  color: z.string().optional(),
  seats: optionalNum,
  condition: z.string().optional(),
  origin: z.string().optional(),
  price: optionalNum,
  priceUnit: z.enum(['Triệu', 'Tỷ', 'Thỏa thuận']),
  provinceName: z.string().optional(),
  districtName: z.string().optional(),
  address: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().regex(/^0\d{9,10}$/, 'Số điện thoại không hợp lệ'),
  description: z.string().optional(),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const MAX_IMAGES = 20;

interface UploadedImage {
  id: string;
  url: string;
  name: string;
}

function opt(record: Record<string, string>) {
  return Object.entries(record).map(([value, label]) => ({ value, label }));
}

export function PostVehicleForm({ editId, onDone }: { editId?: string; onDone?: () => void }) {
  const router = useRouter();
  const isEditing = Boolean(editId);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const editQuery = useQuery({
    queryKey: ['vehicle', editId],
    queryFn: () => vehicleApi.get(editId as string),
    enabled: isEditing,
    retry: 1,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { vehicleType: 'car', priceUnit: 'Triệu', contactPhone: '' },
  });

  // Nạp dữ liệu khi sửa.
  useEffect(() => {
    const v = editQuery.data?.data;
    if (!v) return;
    reset({
      vehicleType: v.vehicleType,
      title: v.title,
      brand: v.brand ?? '',
      modelName: v.modelName ?? '',
      year: v.year ?? undefined,
      mileage: v.mileage ?? undefined,
      transmission: v.transmission ?? '',
      fuelType: v.fuelType ?? '',
      engineCapacity: v.engineCapacity ?? '',
      color: v.color ?? '',
      seats: v.seats ?? undefined,
      condition: v.condition ?? '',
      origin: v.origin ?? '',
      // Giá lưu ở dạng VND; quy về "triệu" cho dễ chỉnh sửa.
      price: v.price > 0 ? v.price / 1_000_000 : undefined,
      priceUnit: 'Triệu',
      provinceName: v.cityName ?? '',
      districtName: v.districtName ?? '',
      address: v.addressLine ?? '',
      contactName: v.contact.name ?? '',
      contactPhone: v.contact.phone ?? '',
      description: v.description ?? '',
      tags: v.tags.join(', '),
    });
    setImages(v.images.map((img, i) => ({ id: img.id || `img-${i}`, url: img.url, name: 'image' })));
  }, [editQuery.data, reset]);

  const vehicleType = watch('vehicleType');
  const brands = vehicleType === 'motorbike' ? MOTORBIKE_BRANDS : CAR_BRANDS;

  // Dropdown tỉnh/quận dựa trên tên (BE lưu province_name/district_name).
  const watchedProvince = watch('provinceName');
  const districtOptions = useMemo(() => {
    const city = cities.find((c) => c.name === watchedProvince);
    return city?.districts ?? [];
  }, [watchedProvince]);
  const provinceReg = register('provinceName');

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setServerError(null);
    const picked = Array.from(files)
      .filter((f) => f.type.startsWith('image/') && f.size <= MAX_IMAGE_BYTES)
      .slice(0, MAX_IMAGES - images.length);
    if (!picked.length) return;

    setUploading(true);
    try {
      const prepared = await Promise.all(picked.map((f) => prepareListingImage(f)));
      const res = await meApi.uploadListingImages(prepared.map((p) => p.file));
      setImages((prev) => [
        ...prev,
        ...res.data.map((u, i) => ({ id: `${Date.now()}-${i}`, url: u.url, name: u.name || 'image' })),
      ]);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Upload ảnh thất bại');
    } finally {
      setUploading(false);
    }
  }

  function removeImage(id: string) {
    setImages((prev) => prev.filter((x) => x.id !== id));
  }

  async function onSubmit(values: FormValues) {
    setServerError(null);
    if (uploading) {
      setServerError('Ảnh đang upload, vui lòng đợi.');
      return;
    }
    if (!images.length) {
      setServerError('Cần ít nhất 1 ảnh.');
      return;
    }

    const num = (v: number | '' | undefined) => (v === '' || v === undefined ? undefined : Number(v));
    const payload: VehicleInput = {
      vehicleType: values.vehicleType,
      title: values.title,
      brand: values.brand,
      modelName: values.modelName,
      year: num(values.year),
      mileage: num(values.mileage),
      transmission: values.transmission,
      fuelType: values.fuelType,
      engineCapacity: values.engineCapacity,
      color: values.color,
      seats: num(values.seats),
      condition: values.condition,
      origin: values.origin,
      price: num(values.price),
      priceUnit: values.priceUnit,
      provinceName: values.provinceName,
      districtName: values.districtName,
      address: values.address,
      contactName: values.contactName,
      contactPhone: values.contactPhone,
      description: values.description,
      images: images.map((x) => x.url),
      tags: (values.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean),
    };

    try {
      if (isEditing) {
        await vehicleApi.update(editId as string, payload);
        onDone?.();
        router.push('/tai-khoan/tin-xe-cua-toi');
      } else {
        const created = await vehicleApi.create(payload);
        onDone?.();
        router.push(`/xe/${created.data.slug}`);
      }
      router.refresh();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : isEditing ? 'Cập nhật tin xe thất bại' : 'Đăng tin xe thất bại');
    }
  }

  if (isEditing && editQuery.isLoading) {
    return (
      <div className="rounded-md border border-brdr bg-white p-6 text-sm text-ink-muted">
        Đang tải dữ liệu tin xe...
      </div>
    );
  }

  if (isEditing && editQuery.isError) {
    return (
      <div className="rounded-md border border-danger bg-danger-soft p-4 text-sm text-danger">
        Không tải được tin xe cần sửa. Vui lòng kiểm tra đăng nhập và thử lại.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Section title="1. Thông tin xe">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Loại xe"
            options={opt(VEHICLE_TYPE_LABELS)}
            {...register('vehicleType')}
            error={errors.vehicleType?.message}
          />
          <div>
            <label className="mb-1 block text-sm font-semibold">Hãng</label>
            <input
              list="vehicle-brands"
              className="w-full rounded-sm border border-brdr px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Toyota, Honda..."
              {...register('brand')}
            />
            <datalist id="vehicle-brands">
              {brands.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </div>
          <Input label="Dòng xe" placeholder="Vios, SH..." {...register('modelName')} />
          <Input label="Năm sản xuất" type="number" placeholder="2020" {...register('year')} error={errors.year?.message} />
        </div>
      </Section>

      <Section title="2. Tiêu đề & mô tả">
        <Input
          label="Tiêu đề tin"
          placeholder="VD: Toyota Vios 2020 số tự động, một chủ"
          {...register('title')}
          error={errors.title?.message}
        />
        <Input label="Số liên hệ" type="tel" placeholder="09xxxxxxxx" {...register('contactPhone')} error={errors.contactPhone?.message} />
        <div>
          <label className="mb-1 block text-sm font-semibold">Mô tả chi tiết</label>
          <textarea
            rows={5}
            className="w-full rounded-sm border border-brdr px-3 py-2 text-sm focus:border-primary focus:outline-none"
            placeholder="Tình trạng xe, lịch sử bảo dưỡng, lý do bán..."
            {...register('description')}
          />
        </div>
      </Section>

      <Section title="3. Thông số kỹ thuật">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input label="Số km đã đi" type="number" placeholder="35000" {...register('mileage')} />
          <Select label="Hộp số" options={[{ value: '', label: '--' }, ...opt(TRANSMISSION_LABELS)]} {...register('transmission')} />
          <Select label="Nhiên liệu" options={[{ value: '', label: '--' }, ...opt(FUEL_LABELS)]} {...register('fuelType')} />
          <Input label="Dung tích / Phân khối" placeholder="1.5L / 150cc" {...register('engineCapacity')} />
          <Input label="Màu sắc" placeholder="Trắng" {...register('color')} />
          {vehicleType === 'car' && <Input label="Số chỗ" type="number" placeholder="5" {...register('seats')} />}
          <Select label="Tình trạng" options={[{ value: '', label: '--' }, ...opt(CONDITION_LABELS)]} {...register('condition')} />
          <Select label="Xuất xứ" options={[{ value: '', label: '--' }, ...opt(ORIGIN_LABELS)]} {...register('origin')} />
        </div>
      </Section>

      <Section title="4. Giá & vị trí">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input label="Giá" type="number" placeholder="450" {...register('price')} />
          <Select
            label="Đơn vị"
            options={[
              { value: 'Triệu', label: 'Triệu' },
              { value: 'Tỷ', label: 'Tỷ' },
              { value: 'Thỏa thuận', label: 'Thỏa thuận' },
            ]}
            {...register('priceUnit')}
          />
          <Select
            label="Tỉnh / Thành"
            placeholder="Chọn tỉnh / thành"
            options={cities.map((c) => ({ value: c.name, label: c.name }))}
            {...provinceReg}
            onChange={(e) => {
              void provinceReg.onChange(e);
              setValue('districtName', '');
            }}
          />
          <Select
            label="Quận / Huyện"
            placeholder="Chọn quận / huyện"
            options={districtOptions.map((d) => ({ value: d.name, label: d.name }))}
            {...register('districtName')}
          />
          <Input label="Địa chỉ" placeholder="Số nhà, đường" {...register('address')} />
          <Input label="Tags (cách nhau dấu phẩy)" placeholder="một chủ, biển đẹp" {...register('tags')} />
        </div>
      </Section>

      <Section title="5. Hình ảnh">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-brdr bg-surface-subtle px-4 py-6 text-center transition hover:border-primary hover:bg-primary/5">
          <UploadCloud size={28} className="text-primary" />
          <span className="mt-2 text-sm font-semibold text-ink">{uploading ? 'Đang upload...' : 'Chọn ảnh xe'}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
            className="sr-only"
            onChange={(e) => {
              void handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </label>
        {images.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((img) => (
              <div key={img.id} className="relative overflow-hidden rounded-md border border-brdr">
                {/* eslint-disable-next-line @next/next/no-img-element -- uploaded URLs */}
                <img src={img.url} alt={img.name} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white hover:bg-danger"
                  aria-label="Xóa ảnh"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      {serverError && <p className="rounded-sm bg-danger-soft px-3 py-2 text-sm text-danger">{serverError}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => (onDone ? onDone() : router.back())}>
          Hủy
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Đăng tin xe
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
