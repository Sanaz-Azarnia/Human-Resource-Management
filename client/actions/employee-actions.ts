// actions/employee-actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { employeesApi, adminApi, isApiError } from '@/lib/api';
import { getBasePermissions } from '@/lib/permissions';
import {
  isValidPositiveInt,
  rethrowIfRedirect,
  type ActionResult,
} from './utils';
import type {
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from '@/lib/api/types';
import { Employee } from '@/types/employee';

function isValidString(value: unknown, minLen = 1, maxLen = 200): value is string {
  return typeof value === 'string' && value.trim().length >= minLen && value.length <= maxLen;
}

function isValidEmail(value: unknown): value is string {
  if (!isValidString(value, 5, 100)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  if (value === '') return true;  
  return /^[0-9+\-\s()]{7,20}$/.test(value);
}

function validateEmployeeDto(dto: unknown, requireAll: boolean): dto is CreateEmployeeDto {
  if (!dto || typeof dto !== 'object') return false;
  const d = dto as Record<string, unknown>;

  if (!isValidString(d.firstname, 1, 100)) return false;
  if (!isValidString(d.lastname, 1, 100)) return false;
  if (!isValidString(d.personnelId, 1, 50)) return false;
  if (!isValidString(d.nationalId, 10, 20)) return false;
  if (!isValidEmail(d.email)) return false;
  if (!isValidPhone(d.phone)) return false;
  if (!isValidString(d.address, 1, 300)) return false;
  
   
  if (typeof d.roleId !== 'number' || !Number.isInteger(d.roleId) || d.roleId <= 0) {
    return false;
  }
  
  if (typeof d.baseSalary !== 'number' || !Number.isFinite(d.baseSalary) || d.baseSalary < 0) return false;

  if (d.avatarUrl !== undefined && d.avatarUrl !== '' && !isValidString(d.avatarUrl, 1, 500)) {
    return false;
  }

  
  if (requireAll) {
     
    if (!isValidString(d.password, 6, 100)) return false;
  } else {
    
    if (d.password !== undefined && d.password !== '') {
      if (!isValidString(d.password, 6, 100)) return false;
    }
  }

  return true;
}

export async function createEmployeeAction(
  dto: CreateEmployeeDto
): Promise<ActionResult> {
  if (!validateEmployeeDto(dto, true)) {
    return { success: false, message: 'Invalid employee data.' };
  }

  try {
    const permissions = await getBasePermissions('employee');
    if (!permissions.canCreate) {
      return { success: false, message: 'Access denied.' };
    }

    await employeesApi.create(dto);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[employee-actions] create failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/employees');
  return { success: true };
}

export async function updateEmployeeAction(
  id: number,
  dto: UpdateEmployeeDto
): Promise<ActionResult> {
  if (!isValidPositiveInt(id)) {
    return { success: false, message: 'Invalid employee ID.' };
  }

  if (!validateEmployeeDto(dto, false)) {
    return { success: false, message: 'Invalid employee data.' };
  }

  try {
    const permissions = await getBasePermissions('employee');
    if (!permissions.canEditAll && !permissions.canEditOwn) {
      return { success: false, message: 'Access denied.' };
    }

    await employeesApi.update(id, dto);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[employee-actions] update failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/employees');
  return { success: true };
}

export async function deleteEmployeeAction(id: number): Promise<ActionResult> {
  if (!isValidPositiveInt(id)) {
    return { success: false, message: 'Invalid employee ID.' };
  }

  try {
    const permissions = await getBasePermissions('employee');
    if (!permissions.canDelete) {
      return { success: false, message: 'Access denied.' };
    }

    await employeesApi.delete(id);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[employee-actions] delete failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/employees');
  return { success: true };
}

export async function changeEmployeeRoleAction(
  employeeId: number,
  roleId: number
): Promise<ActionResult> {
  if (!isValidPositiveInt(employeeId)) {
    return { success: false, message: 'Invalid employee ID.' };
  }
  if (!isValidPositiveInt(roleId)) {
    return { success: false, message: 'Invalid role ID.' };
  }

  try {
    const permissions = await getBasePermissions('employee');
    if (!permissions.canEditAll) {
      return { success: false, message: 'Access denied.' };
    }

    await adminApi.changeEmployeeRole(employeeId, { roleId });
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[employee-actions] changeRole failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/employees');
  return { success: true };
}

 

export async function searchEmployeeAction(
  searchType: 'id' | 'personnel',
  searchValue: string
): Promise<{ success: boolean; data?: Employee; message?: string }> {
   
  if (!searchValue || searchValue.trim().length === 0) {
    return { success: false, message: 'Please enter a value.' };
  }

  const trimmed = searchValue.trim();

   
  if (trimmed.length > 100) {
    return { success: false, message: 'Input too long.' };
  }

  try {
    
    const permissions = await getBasePermissions('employee');
    if (!permissions.canViewAll && !permissions.canViewOwn) {
      return { success: false, message: 'Access denied.' };
    }

    let employee: Employee | null = null;

    if (searchType === 'id') {
      const id = parseInt(trimmed, 10);
      if (!isValidPositiveInt(id)) {
        return { success: false, message: 'Invalid employee ID.' };
      }
      employee = await employeesApi.getById(id);
    } else {
      
      if (!/^[a-zA-Z0-9\-]+$/.test(trimmed)) {
        return { success: false, message: 'Invalid personnel ID format.' };
      }
      employee = await employeesApi.getByPersonnelId(trimmed);
    }

    if (!employee) {
      return { success: false, message: 'Employee not found.' };
    }

    return { success: true, data: employee };
  } catch (error) {
    rethrowIfRedirect(error);

    if (isApiError(error) && error.status === 404) {
      return { success: false, message: 'Employee not found.' };
    }
    if (isApiError(error) && error.status === 401) {
      redirect('/login');
    }

    console.error('[employee-actions] search failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}