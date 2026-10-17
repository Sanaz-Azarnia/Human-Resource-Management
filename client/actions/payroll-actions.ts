'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { payrollsApi, isApiError } from '@/lib/api';
import { getBasePermissions } from '@/lib/permissions';
import {
  isValidPositiveInt,
  rethrowIfRedirect,
  type ActionResult,
} from './utils';
import type {
  CreatePayrollDto,
  UpdatePayrollDto,
} from '@/lib/api/types';

function isValidYear(value: unknown): boolean {
  if (typeof value !== 'number') return false;
  return Number.isInteger(value) && value >= 2000 && value <= 3000;
}

function isValidMonth(value: unknown): boolean {
  if (typeof value !== 'number') return false;
  return Number.isInteger(value) && value >= 1 && value <= 12;
}

function isValidAmount(value: unknown): boolean {
  if (typeof value !== 'number') return false;
  return Number.isFinite(value) && value >= 0 && value < 1e15;
}

function validatePayrollDto(dto: unknown): dto is CreatePayrollDto | UpdatePayrollDto {
  if (!dto || typeof dto !== 'object') return false;
  const d = dto as Record<string, unknown>;

  if (d.userId !== undefined && !isValidPositiveInt(d.userId)) return false;
  if (d.year !== undefined && !isValidYear(d.year)) return false;
  if (d.month !== undefined && !isValidMonth(d.month)) return false;

  const amountFields = ['baseSalary', 'overTime', 'bonus', 'tax', 'insurance',
                        'grossSalary', 'totalDeduction', 'netSalary'];
  for (const field of amountFields) {
    if (d[field] !== undefined && !isValidAmount(d[field])) return false;
  }

  if (d.isPaid !== undefined && typeof d.isPaid !== 'boolean') return false;

  return true;
}

export async function createPayrollAction(
  dto: CreatePayrollDto
): Promise<ActionResult> {
  if (!isValidPositiveInt(dto.userId)) {
    return { success: false, message: 'Invalid employee.' };
  }
  if (!validatePayrollDto(dto)) {
    return { success: false, message: 'Invalid payroll data.' };
  }

  try {
    const permissions = await getBasePermissions('payroll');
    if (!permissions.canCreate) {
      return { success: false, message: 'Access denied.' };
    }

    await payrollsApi.create(dto);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[payroll-actions] create failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/payroll');
  return { success: true };
}

export async function updatePayrollAction(
  id: number,
  dto: UpdatePayrollDto
): Promise<ActionResult> {
  if (!isValidPositiveInt(id)) {
    return { success: false, message: 'Invalid payroll ID.' };
  }
  if (!validatePayrollDto(dto)) {
    return { success: false, message: 'Invalid payroll data.' };
  }

  try {
    const permissions = await getBasePermissions('payroll');
    if (!permissions.canEditAll && !permissions.canEditOwn) {
      return { success: false, message: 'Access denied.' };
    }

    await payrollsApi.update(id, dto);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[payroll-actions] update failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/payroll');
  return { success: true };
}

export async function deletePayrollAction(id: number): Promise<ActionResult> {
  if (!isValidPositiveInt(id)) {
    return { success: false, message: 'Invalid payroll ID.' };
  }

  try {
    const permissions = await getBasePermissions('payroll');
    if (!permissions.canDelete) {
      return { success: false, message: 'Access denied.' };
    }

    await payrollsApi.delete(id);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[payroll-actions] delete failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/payroll');
  return { success: true };
}