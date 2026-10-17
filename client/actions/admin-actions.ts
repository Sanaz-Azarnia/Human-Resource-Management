'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { adminApi, isApiError } from '@/lib/api';
import {
  isValidPositiveInt,
  rethrowIfRedirect,
  type ActionResult,
} from './utils';
import type {
  CreateRoleDto,
} from '@/lib/api/types';

function isValidRoleName(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  return trimmed.length >= 2 && trimmed.length <= 50 && /^[a-zA-Z0-9_\-\s]+$/.test(trimmed);
}

async function requireAdminAccess(): Promise<boolean> {
  
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return false;

  try {
    const BASE_URL = process.env.NEXT_PUBLIC_APP_URL;
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: `token=${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return false;
    const user = await res.json();
    const perms: string[] = user.permissions || [];

    
    return perms.includes('employee:edit:all') && perms.includes('employee:delete');
  } catch {
    return false;
  }
}

export async function createRoleAction(dto: CreateRoleDto): Promise<ActionResult> {
  if (!isValidRoleName(dto.name)) {
    return { success: false, message: 'Invalid role name.' };
  }

  try {
    const isAdmin = await requireAdminAccess();
    if (!isAdmin) {
      return { success: false, message: 'Access denied.' };
    }

    await adminApi.createRole(dto);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[admin-actions] createRole failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/admin/roles');
  return { success: true };
}

export async function assignPermissionsAction(
  roleId: number,
  permissionIds: number[]
): Promise<ActionResult> {
  if (!isValidPositiveInt(roleId)) {
    return { success: false, message: 'Invalid role ID.' };
  }

  if (!Array.isArray(permissionIds)) {
    return { success: false, message: 'Invalid permissions.' };
  }

  // همه ID ها باید معتبر و منحصر به فرد باشند
  const uniqueIds = new Set(permissionIds);
  if (uniqueIds.size !== permissionIds.length) {
    return { success: false, message: 'Duplicate permissions.' };
  }

  for (const id of permissionIds) {
    if (!isValidPositiveInt(id)) {
      return { success: false, message: 'Invalid permission ID.' };
    }
  }

  try {
    const isAdmin = await requireAdminAccess();
    if (!isAdmin) {
      return { success: false, message: 'Access denied.' };
    }

    await adminApi.assignPermissions(roleId, { permissionIds });
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[admin-actions] assignPermissions failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/admin/roles');
  return { success: true };
}

export async function removePermissionAction(
  roleId: number,
  permissionId: number
): Promise<ActionResult> {
  if (!isValidPositiveInt(roleId)) {
    return { success: false, message: 'Invalid role ID.' };
  }
  if (!isValidPositiveInt(permissionId)) {
    return { success: false, message: 'Invalid permission ID.' };
  }

  try {
    const isAdmin = await requireAdminAccess();
    if (!isAdmin) {
      return { success: false, message: 'Access denied.' };
    }

    await adminApi.removePermission(roleId, permissionId);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[admin-actions] removePermission failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/admin/roles');
  return { success: true };
}