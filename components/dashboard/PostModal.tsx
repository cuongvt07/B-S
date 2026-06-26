'use client';

import { Building2, Car, LogIn } from 'lucide-react';
import { Modal, SegmentedControl, Button } from '@/components/ui';
import { usePostModal, type PostVertical } from '@/lib/hooks/usePostModal';
import { useCurrentUser } from '@/lib/hooks/useAuth';
import { useAuthModal } from '@/lib/hooks/useAuthModal';
import { PostListingForm } from './PostListingForm';
import { PostVehicleForm } from './PostVehicleForm';

/**
 * Unified "Đăng tin" popup: one dialog, a switch to flip between the
 * real-estate and vehicle posting forms.
 */
export function PostModal() {
  const open = usePostModal((s) => s.open);
  const vertical = usePostModal((s) => s.vertical);
  const editId = usePostModal((s) => s.editId);
  const setVertical = usePostModal((s) => s.setVertical);
  const close = usePostModal((s) => s.close);

  const { data: user, isLoading } = useCurrentUser();
  const openLogin = useAuthModal((s) => s.openLogin);

  return (
    <Modal
      open={open}
      onClose={close}
      size="xl"
      title="Đăng tin mới"
      description="Chọn loại tin bạn muốn đăng — bất động sản hoặc xe cộ."
    >
      <div className="mb-5 flex justify-center">
        <SegmentedControl
          options={[
            { value: 'property', label: 'Bất động sản' },
            { value: 'vehicle', label: 'Xe cộ' },
          ]}
          value={vertical}
          onChange={(v) => setVertical(v as PostVertical)}
          accent="primary"
        />
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-sm text-ink-muted">Đang tải…</div>
      ) : !user ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="icon-chip grid h-14 w-14 place-items-center rounded-full bg-brand/10 text-brand">
            {vertical === 'property' ? <Building2 size={26} /> : <Car size={26} />}
          </span>
          <div>
            <p className="font-semibold text-ink">Đăng nhập để đăng tin</p>
            <p className="mt-1 text-sm text-ink-muted">
              Bạn cần đăng nhập trước khi đăng tin {vertical === 'property' ? 'bất động sản' : 'xe cộ'}.
            </p>
          </div>
          <Button
            onClick={() => {
              close();
              openLogin('/tai-khoan/dang-tin');
            }}
            leftIcon={<LogIn size={16} />}
          >
            Đăng nhập
          </Button>
        </div>
      ) : vertical === 'property' ? (
        <PostListingForm editId={editId} onDone={close} />
      ) : (
        <PostVehicleForm editId={editId} onDone={close} />
      )}
    </Modal>
  );
}
