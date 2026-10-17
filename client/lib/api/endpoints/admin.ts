import { apiFetch } from '../http';
import type {
  AssignPermissionsDto,
  ChangeEmployeeRoleDto,
  CreateRoleDto,
  Permission,
  Role,
  UserPermissions,
} from '../types';

export const adminApi = {
  getRoles(init?: RequestInit) {
    return apiFetch<Role[]>('/api/admin/roles', init);
  },

  createRole(dto: CreateRoleDto, init?: RequestInit) {
    return apiFetch<Role>('/api/admin/roles', {
      ...init,
      method: 'POST',
      body: dto,
    });
  },

  assignPermissions(roleId: number, dto: AssignPermissionsDto, init?: RequestInit) {
    return apiFetch<void>(`/api/admin/roles/${roleId}/permissions`, {
      ...init,
      method: 'POST',
      body: dto,
    });
  },

  removePermission(roleId: number, permissionId: number, init?: RequestInit) {
    return apiFetch<void>(
      `/api/admin/roles/${roleId}/permissions/${permissionId}`,
      {
        ...init,
        method: 'DELETE',
      }
    );
  },

  getPermissions(init?: RequestInit) {
    return apiFetch<Permission[]>('/api/admin/permissions', init);
  },

  getUserPermissions(employeeId: number, init?: RequestInit) {
    return apiFetch<UserPermissions>(
      `/api/admin/employee/${employeeId}/permissions`,
      init
    );
  },

  changeEmployeeRole(employeeId: number, dto: ChangeEmployeeRoleDto, init?: RequestInit) {
    return apiFetch<void>(`/api/admin/employee/${employeeId}/role`, {
      ...init,
      method: 'PUT',
      body: dto,
    });
  },
};