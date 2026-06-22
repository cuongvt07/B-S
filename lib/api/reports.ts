/**
 * Reports API — gửi báo cáo vi phạm bài đăng / tài khoản.
 * POST /api/v1/reports — không cần đăng nhập, rate limit 5 lần / 5 phút.
 */
import { realFetch } from './realClient';

export type ReportReason =
  | 'tin_ao'
  | 'gia_ao'
  | 'ngon_tu'
  | 'anh_vi_pham'
  | 'sai_thong_tin'
  | 'khac';

export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'tin_ao', label: 'Tin ảo' },
  { value: 'gia_ao', label: 'Giá ảo' },
  { value: 'ngon_tu', label: 'Ngôn từ vi phạm' },
  { value: 'anh_vi_pham', label: 'Ảnh vi phạm' },
  { value: 'sai_thong_tin', label: 'Sai thông tin' },
  { value: 'khac', label: 'Khác' },
];

export interface ReportInput {
  target_type: 'listing' | 'user';
  listing_id?: number;
  reported_user_id?: number;
  reason: ReportReason;
  detail?: string;
  reporter_name?: string;
  reporter_phone?: string;
}

export interface ReportResponse {
  success: boolean;
  data: { id: number };
  message: string;
}

export const reportApi = {
  submit(input: ReportInput): Promise<ReportResponse> {
    return realFetch<ReportResponse>('/reports', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
};
