import { apiFetch } from '../http';
import type {
  CreatePayrollDto,
  Payroll,
  UpdatePayrollDto,
} from '../types';

export const payrollsApi = {
  getAll(init?: RequestInit) {
    return apiFetch<Payroll[]>('/api/payroll', init);
  },

  getById(id: number, init?: RequestInit) {
    return apiFetch<Payroll>(`/api/payroll/${id}`, init);
  },

  getByEmployeeId(employeeId: number, init?: RequestInit) {
    return apiFetch<Payroll[]>(`/api/payroll/employee/${employeeId}`, init);
  },

  create(dto: CreatePayrollDto, init?: RequestInit) {
    return apiFetch<Payroll>('/api/payroll', {
      ...init,
      method: 'POST',
      body: dto,
    });
  },

  update(id: number, dto: UpdatePayrollDto, init?: RequestInit) {
    return apiFetch<Payroll>(`/api/payroll/${id}`, {
      ...init,
      method: 'PUT',
      body: dto,
    });
  },

  delete(id: number, init?: RequestInit) {
    return apiFetch<void>(`/api/payroll/${id}`, {
      ...init,
      method: 'DELETE',
    });
  },
};