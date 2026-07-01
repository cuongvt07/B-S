'use client';

import { useMemo, useState } from 'react';
import { Bookmark } from '@/components/icons';
import { Button, Input, Modal } from '@/components/ui';
import { useSavedSearches } from '@/lib/hooks/useSavedSearches';

interface Props {
  params: Record<string, string | undefined>;
  suggestedLabel?: string;
}

export function SaveSearchButton({ params, suggestedLabel }: Props) {
  const { save } = useSavedSearches();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  const filtered: Record<string, string> = useMemo(() => {
    const result: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') result[k] = String(v);
    }
    return result;
  }, [params]);

  const hasFilters = Object.keys(filtered).length > 0;

  function openModal() {
    setLabel(suggestedLabel || 'Tìm kiếm mới');
    setOpen(true);
  }

  function handleSave() {
    if (!label.trim()) return;
    save(label.trim(), filtered);
    setOpen(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  }

  return (
    <div className="inline-flex flex-col items-start">
      <Button
        variant="outline"
        size="sm"
        leftIcon={<Bookmark size={14} />}
        onClick={openModal}
        disabled={!hasFilters}
      >
        {hasFilters ? 'Lưu tìm kiếm' : 'Đặt bộ lọc trước khi lưu'}
      </Button>
      {showSaved && <p className="mt-1 text-xs text-price">Đã lưu tìm kiếm</p>}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Lưu bộ lọc tìm kiếm"
        description="Bạn sẽ tìm thấy bộ lọc này trong trang Tìm kiếm đã lưu."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Huỷ
            </Button>
            <Button onClick={handleSave} disabled={!label.trim()} leftIcon={<Bookmark size={14} />}>
              Lưu
            </Button>
          </>
        }
      >
        <Input
          label="Đặt tên cho tìm kiếm"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Vd: Căn hộ 2PN Quận 7 dưới 15tr"
          autoFocus
        />
      </Modal>
    </div>
  );
}
