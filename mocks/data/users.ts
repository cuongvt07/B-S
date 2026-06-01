import type { User } from '@/types';

export const users: User[] = [
  {
    id: 'u-001',
    email: 'an.nguyen@example.com',
    name: 'Nguyễn Văn An',
    phone: '0901234567',
    avatarUrl: 'https://i.pravatar.cc/120?img=12',
    role: 'user',
    verifiedAt: '2025-08-12T03:00:00.000Z',
    createdAt: '2024-06-01T03:00:00.000Z',
  },
  {
    id: 'u-002',
    email: 'broker.linh@example.com',
    name: 'Trần Thuỳ Linh',
    phone: '0938765432',
    avatarUrl: 'https://i.pravatar.cc/120?img=47',
    role: 'broker',
    verifiedAt: '2025-02-15T03:00:00.000Z',
    createdAt: '2023-11-20T03:00:00.000Z',
  },
  {
    id: 'u-003',
    email: 'duc.pham@example.com',
    name: 'Phạm Quốc Đức',
    phone: '0912345678',
    avatarUrl: 'https://i.pravatar.cc/120?img=33',
    role: 'user',
    createdAt: '2025-01-05T03:00:00.000Z',
  },
];

export const userById = new Map(users.map((u) => [u.id, u]));

export const SEED_PASSWORD = '123456';
