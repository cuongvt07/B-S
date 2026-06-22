'use client';

import { useState, type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Flag, CheckCircle2 } from 'lucide-react';
import { Modal, Button, Input } from '@/components/ui';
import { reportApi, REPORT_REASONS, type ReportReason } from '@/lib/api/reports';

type Props = {
  targetType: 'listing' | 'user';
  listingId?: number;
  reportedUserId?: number;
  /** Render as a subtle text link (default) or a full button. */
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

  const mutation = useMutation({
    mutationFn: () =>
      reportApi.submit({
        target_type: targetType,
        listing_id: listingId,
        reported_user_id: reportedUserId,
        reason,
        detail: detail.trim() || undefined,
        reporter_name: name.trim() || undefined,
        reporter_phone: phone.trim() || undefined,
      }),
    onSuccess: () => setDone(true),
    onError: (e) => setError(e instanceof Error ? e.message : 'Gửi báo cáo thất bại'),
  });

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    mutation.mutate();
  }

  function close() {
    setOpen(false);
    // reset after the close animation
    setTimeout(() => {
      setDone(false);
      setError(null);
      setDetail('');
      setReason('tin_ao');
    }, 200);
  }

  return (
    <>
      {variant === 'button' ? (
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          <Flag size={16} /> {label}
        </Button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-danger"
        >
          <Flag size={13} /> {label}
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
              Quản trị viên sẽ xem xét và xử lý trong thời gian sớm nhất.
            </p>
            <Button type="button" onClick={close} className="mt-2">
              Đóng
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Lý do báo cáo</label>
              <div className="grid grid-cols-2 gap-2">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r.value}
                    className={
                      'flex cursor-pointer items-center gap-2 rounded-sm border px-3 py-2 text-sm ' +
                      (reason === r.value
                        ? 'border-primary bg-primary/5 text-ink'
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

            <div>
              <label className="mb-1 block text-sm font-medium text-ink">
                Mô tả chi tiết <span className="text-ink-muted">(không bắt buộc)</span>
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

            <div className="grid grid-cols-2 gap-2">
              <Input
                label="Tên của bạn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Không bắt buộc"
              />
              <Input
                label="SĐT liên hệ"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Không bắt buộc"
              />
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={close}>
                Hủy
              </Button>
              <Button type="submit" variant="danger" loading={mutation.isPending}>
                Gửi báo cáo
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
