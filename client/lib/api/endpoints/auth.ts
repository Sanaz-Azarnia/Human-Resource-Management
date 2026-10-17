import { apiFetch } from '../http';
import type { CurrentUser } from '../types';

export const authApi = {
  me(init?: RequestInit) {
    return apiFetch<CurrentUser>('/api/auth/me', init);
  },
};