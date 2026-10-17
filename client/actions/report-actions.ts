'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { reportsApi, isApiError } from '@/lib/api';
import { getReportPermissions } from '@/lib/permissions';
import {
  isValidPositiveInt,
  rethrowIfRedirect,
  type ActionResult,
} from './utils';
import type {
  CreateReportDto,
  UpdateReportDto,
} from '@/lib/api/types';

function isValidString(value: unknown, minLen = 1, maxLen = 500): value is string {
  return typeof value === 'string' && value.trim().length >= minLen && value.length <= maxLen;
}

function isValidUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  if (value === '') return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateReportDto(dto: unknown): dto is CreateReportDto | UpdateReportDto {
  if (!dto || typeof dto !== 'object') return false;
  const d = dto as Record<string, unknown>;

  if (d.userId !== undefined && !isValidPositiveInt(d.userId)) return false;
  if (d.title !== undefined && !isValidString(d.title, 1, 200)) return false;
  if (d.content !== undefined && !isValidString(d.content, 1, 10000)) return false;
  if (d.type !== undefined && !isValidString(d.type, 1, 50)) return false;
  if (d.attachmentUrl !== undefined && !isValidUrl(d.attachmentUrl)) return false;

  return true;
}

export async function createReportAction(
  dto: CreateReportDto
): Promise<ActionResult> {
  if (!isValidPositiveInt(dto.userId)) {
    return { success: false, message: 'Invalid employee.' };
  }
  if (!validateReportDto(dto)) {
    return { success: false, message: 'Invalid report data.' };
  }

  try {
    const permissions = await getReportPermissions();
    if (!permissions.canCreate) {
      return { success: false, message: 'Access denied.' };
    }

    await reportsApi.create(dto);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[report-actions] create failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/reports');
  return { success: true };
}

export async function updateReportAction(
  id: number,
  dto: UpdateReportDto
): Promise<ActionResult> {
  if (!isValidPositiveInt(id)) {
    return { success: false, message: 'Invalid report ID.' };
  }
  if (!validateReportDto(dto)) {
    return { success: false, message: 'Invalid report data.' };
  }

  try {
    const permissions = await getReportPermissions();
    if (!permissions.canEditAll && !permissions.canEditOwn) {
      return { success: false, message: 'Access denied.' };
    }

    await reportsApi.update(id, dto);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[report-actions] update failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/reports');
  return { success: true };
}

export async function deleteReportAction(id: number): Promise<ActionResult> {
  if (!isValidPositiveInt(id)) {
    return { success: false, message: 'Invalid report ID.' };
  }

  try {
    const permissions = await getReportPermissions();
    if (!permissions.canDelete && !permissions.canDeleteOwn) {
      return { success: false, message: 'Access denied.' };
    }

    await reportsApi.delete(id);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[report-actions] delete failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/reports');
  return { success: true };
}