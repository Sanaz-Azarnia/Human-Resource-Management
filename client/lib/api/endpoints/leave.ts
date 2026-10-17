import { apiFetch } from '../http';
import type {
  ApproveLeaveRequestDto,
  CreateLeaveRequestDto,
  LeaveRequest,
  RejectLeaveRequestDto,
  UpdateLeaveRequestDto,
} from '../types';

export const leaveRequestsApi = {
  getAll(init?: RequestInit) {
    return apiFetch<LeaveRequest[]>('/api/leave', init);
  },

  getById(id: number, init?: RequestInit) {
    return apiFetch<LeaveRequest>(`/api/leave/${id}`, init);
  },

  getByEmployeeId(employeeId: number, init?: RequestInit) {
    return apiFetch<LeaveRequest[]>(`/api/leave/employee/${employeeId}`, init);
  },

  getPending(init?: RequestInit) {
    return apiFetch<LeaveRequest[]>('/api/leave/pending', init);
  },

  create(dto: CreateLeaveRequestDto, init?: RequestInit) {
    return apiFetch<LeaveRequest>('/api/leave', {
      ...init,
      method: 'POST',
      body: dto,
    });
  },

  update(id: number, dto: UpdateLeaveRequestDto, init?: RequestInit) {
    return apiFetch<LeaveRequest>(`/api/leave/${id}`, {
      ...init,
      method: 'PUT',
      body: dto,
    });
  },

  delete(id: number, init?: RequestInit) {
    return apiFetch<void>(`/api/leave/${id}`, {
      ...init,
      method: 'DELETE',
    });
  },

  approve(id: number, dto?: ApproveLeaveRequestDto, init?: RequestInit) {
    return apiFetch<LeaveRequest>(`/api/leave/${id}/approve`, {
      ...init,
      method: 'PUT',
      body: dto ?? {},
    });
  },

  reject(id: number, dto?: RejectLeaveRequestDto, init?: RequestInit) {
    return apiFetch<LeaveRequest>(`/api/leave/${id}/reject`, {
      ...init,
      method: 'PUT',
      body: dto ?? {},
    });
  },
};