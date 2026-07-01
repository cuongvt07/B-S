'use client';

import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Flag, CheckCircle2, X } from 'lucide-react';
import { Modal, Button, Input } from '@/components/ui';
import { reportApi, REPORT_REASONS, type ReportReason } from '@/lib/api/reports';

type Props = {
  targetType: 'listing' | 'user';
  listingId?: number;
  reportedUserId?: number;
  variant?: 'link' | 'button';
  label?: string;
};

export function ReportButton({
  targetType,
  listingId,
  reportedUserId,
  variant = 'link',
  label = 'Báo cáo',
}: Props) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>('tin_ao');
  const [detail, setDetail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const missingTarget =
    (targetType === 'listing' && listingId === undefined) ||
    (targetType === 'user' && reportedUserId === undefined);

  const mutation = useMutation({
    mutationFn: () => {
      if (missingTarget) {
        throw new Error(
          targetType === 'listing'
            ? 'Không xác định được tin đăng cần báo cáo.'
            : 'Không xác định được tài khoản cần báo cáo.'
        );
      }

      return reportApi.submit({
        target_type: targetType,
        listing_id: listingId,
        reported_user_id: reportedUserId,
        reason,
        detail: detail.trim() || undefined,
        reporter_name: name.trim() || undefined,
        reporter_phone: phone.trim() || undefined,
      });
    },
    onSuccess: () => setDone(true),
    onError: (e) => setError(e instanceof Error ? e.message : 'Gửi báo cáo thất bại'),
  });

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (missingTarget) {
      setError(
        targetType === 'listing'
          ? 'Không xác định được tin đăng cần báo cáo.'
          : 'Không xác định được tài khoản cần báo cáo.'
      );
      return;
    }
    mutation.mutate();
  }

  function close() {
    setOpen(false);
    setTimeout(() => {
      setDone(false);
      setError(null);
      setDetail('');
      setName('');
      setPhone('');
      setReason('tin_ao');
    }, 200);
  }

  return (
    <>
      {variant === 'button' ? (
        <Button
          type="button"
          variant="outline"
          leftIcon={<Flag size={16} className="shrink-0" />}
          onClick={() => setOpen(true)}
        >
          {label}
        </Button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-danger transition-colors"
        >
          <Flag size={13} className="shrink-0" />
          {label}
        </button>
      )}

      <Modal
        open={open}
        onClose={close}
        size="sm"
        title={targetType === 'listing' ? 'Báo cáo tin đăng' : 'Báo cáo tài khoản'}
        description={
          done
            ? undefined
            : 'Cho chúng tôi biết vấn đề bạn gặp với nội dung này. Báo cáo được gửi tới quản trị viên.'
        }
      >
        {done ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 size={40} className="text-price" />
            <p className="text-sm font-semibold text-ink">Đã gửi báo cáo. Cảm ơn bạn!</p>
            <p className="text-sm text-ink-muted">
              Quản trị viên sẽ xem xét và xử lý trong vòng 24 giờ.
            </p>
            <Button
              type="button"
              variant="outline"
              leftIcon={<X size={14} className="shrink-0" />}
              onClick={close}
              className="mt-2"
            >
              Đóng
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {/* Lý do báo cáo */}
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">Lý do báo cáo</label>
              <div className="grid grid-cols-2 gap-2">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r.value}
                    className={
                      'flex cursor-pointer items-center gap-2 rounded-sm border px-3 py-2 text-sm transition-colors ' +
                      (reason === r.value
                        ? 'border-primary bg-primary/5 text-ink font-medium'
                        : 'border-brdr text-ink-muted hover:border-primary/50')
                    }
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={() => setReason(r.value)}
                      className="accent-primary"
                    />
                    {r.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Chi tiết */}
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">
                Mô tả chi tiết{' '}
                <span className="font-normal text-ink-muted">(không bắt buộc)</span>
              </label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                rows={3}
                maxLength={2000}
                placeholder="Mô tả cụ thể vấn đề..."
                className="w-full rounded-sm border border-brdr px-3 py-2 text-sm text-ink outline-none focus:border-primary"
              />
            </div>

            {/* Thông tin người báo cáo */}
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Tên của bạn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Không bắt buộc"
              />
              <Input
                label="Số điện thoại"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Không bắt buộc"
              />
            </div>

            {error && (
              <p className="rounded-sm bg-danger/5 px-3 py-2 text-xs text-danger">{error}</p>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={close}
                className="flex-1"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1"
                loading={mutation.isPending}
                leftIcon={<Flag size={14} className="shrink-0" />}
              >
                Gửi báo cáo
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
