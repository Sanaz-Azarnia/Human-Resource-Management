// lib/api/endpoints/employees.ts
import { apiFetch, buildQueryString } from '../http';
import type {
  CreateEmployeeDto,
  Employee,
  GetEmployeesParams,
  UpdateEmployeeDto,
} from '@/lib/api/types';

export const employeesApi = {
  getAll(params?: GetEmployeesParams, init?: RequestInit) {
    const qs = buildQueryString(params);

    return apiFetch<Employee[]>(`/api/employees${qs}`, init);
  },

  getById(id: number, init?: RequestInit) {
    return apiFetch<Employee>(`/api/employees/${id}`, init);
  },

  getByPersonnelId(personnelId: string, init?: RequestInit) {
    return apiFetch<Employee>(
      `/api/employees/personnelId/${encodeURIComponent(personnelId)}`,
      init
    );
  },

  create(dto: CreateEmployeeDto, init?: RequestInit) {
    return apiFetch<Employee>('/api/employees', {
      ...init,
      method: 'POST',
      body: dto,
    });
  },

  update(id: number, dto: UpdateEmployeeDto, init?: RequestInit) {
    return apiFetch<Employee>(`/api/employees/${id}`, {
      ...init,
      method: 'PUT',
      body: dto,
    });
  },

  delete(id: number, init?: RequestInit) {
    return apiFetch<void>(`/api/employees/${id}`, {
      ...init,
      method: 'DELETE',
    });
  },
};