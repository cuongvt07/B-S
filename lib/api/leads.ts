/**
 * Leads API — gửi lead công khai (form liên hệ trên website).
 * POST /api/v1/leads — không cần đăng nhập, rate limit 3 lần / 5 phút.
 */
import { realFetch } from './realClient';

export interface LeadInput {
  name: string;
  phone: string;
  budget_from?: number; // VND
  budget_to?: number; // VND
  message?: string;
  listing_id?: number;
}

export interface LeadResponse {
  success: boolean;
  data: {
    lead_id: number;
    code: string;
  };
  message: string;
}

export const leadApi = {
  submit(input: LeadInput): Promise<LeadResponse> {
    return realFetch<LeadResponse>('/leads', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
};
