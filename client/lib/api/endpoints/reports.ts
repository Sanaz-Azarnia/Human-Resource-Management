import { apiFetch } from '../http';
import type {
  CreateReportDto,
  Report,
  UpdateReportDto,
} from '../types';

export const reportsApi = {
  getAll(init?: RequestInit) {
    return apiFetch<Report[]>('/api/report', init);
  },

  getById(id: number, init?: RequestInit) {
    return apiFetch<Report>(`/api/report/${id}`, init);
  },

  getByEmployeeId(employeeId: number, init?: RequestInit) {
    return apiFetch<Report[]>(`/api/report/employee/${employeeId}`, init);
  },

  create(dto: CreateReportDto, init?: RequestInit) {
    return apiFetch<Report>('/api/report', {
      ...init,
      method: 'POST',
      body: dto,
    });
  },

  update(id: number, dto: UpdateReportDto, init?: RequestInit) {
    return apiFetch<Report>(`/api/report/${id}`, {
      ...init,
      method: 'PUT',
      body: dto,
    });
  },

  delete(id: number, init?: RequestInit) {
    return apiFetch<void>(`/api/report/${id}`, {
      ...init,
      method: 'DELETE',
    });
  },
};