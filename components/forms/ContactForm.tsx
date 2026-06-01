'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send } from 'lucide-react';
import { Button, Input } from '@/components/ui';

const schema = z.object({
  name: z.string().min(2, 'Họ tên tối thiểu 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  subject: z.string().min(2, 'Vui lòng nhập chủ đề'),
  message: z.string().min(10, 'Nội dung tối thiểu 10 ký tự'),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    alert('Đã gửi yêu cầu, chúng tôi sẽ liên hệ sớm.');
    reset();
    void values;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-brdr bg-white p-6 shadow-raised">
      <h2 className="text-lg font-semibold text-ink">Gửi yêu cầu liên hệ</h2>
      <Input label="Họ tên" autoComplete="name" {...register('name')} error={errors.name?.message} />
      <Input label="Email" type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
      <Input label="Chủ đề" {...register('subject')} error={errors.subject?.message} />
      <div>
        <label className="mb-1 block text-sm font-semibold text-ink">Nội dung</label>
        <textarea
          {...register('message')}
          className="block min-h-[120px] w-full rounded-sm border border-brdr p-3 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
          placeholder="Mô tả vấn đề hoặc yêu cầu của bạn..."
        />
        {errors.message && <p className="mt-1 text-xs text-danger">{errors.message.message}</p>}
      </div>
      <Button type="submit" loading={submitting} leftIcon={<Send size={14} />}>
        Gửi yêu cầu
      </Button>
    </form>
  );
}
