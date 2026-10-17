'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { leaveRequestsApi, isApiError } from '@/lib/api';
import { getLeavePermissions } from '@/lib/permissions';
import {
  isValidPositiveInt,
  rethrowIfRedirect,
  type ActionResult,
} from './utils';
import type {
  CreateLeaveRequestDto,
  UpdateLeaveRequestDto,
  ApproveLeaveRequestDto,
  RejectLeaveRequestDto,
} from '@/lib/api/types';

function isValidString(value: unknown, minLen = 1, maxLen = 500): value is string {
  return typeof value === 'string' && value.trim().length >= minLen && value.length <= maxLen;
}

function isValidDateString(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 50) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

function validateLeaveDto(dto: unknown): dto is CreateLeaveRequestDto | UpdateLeaveRequestDto {
  if (!dto || typeof dto !== 'object') return false;
  const d = dto as Record<string, unknown>;

  if (d.userId !== undefined && !isValidPositiveInt(d.userId)) return false;
  if (d.title !== undefined && !isValidString(d.title, 1, 200)) return false;
  if (d.reason !== undefined && !isValidString(d.reason, 1, 2000)) return false;
  if (d.startDate !== undefined && !isValidDateString(d.startDate)) return false;
  if (d.endDate !== undefined && !isValidDateString(d.endDate)) return false;
  if (d.type !== undefined && !isValidString(d.type, 1, 50)) return false;
  if (d.adminNote !== undefined && typeof d.adminNote !== 'string') return false;
  if (typeof d.adminNote === 'string' && d.adminNote.length > 1000) return false;

   
  if (isValidDateString(d.startDate) && isValidDateString(d.endDate)) {
    if (new Date(d.startDate as string) > new Date(d.endDate as string)) {
      return false;
    }
  }

  return true;
}

function validateNoteDto(dto: unknown): dto is ApproveLeaveRequestDto | RejectLeaveRequestDto {
  if (!dto || typeof dto !== 'object') return false;
  const d = dto as Record<string, unknown>;
  if (d.adminNote !== undefined) {
    if (typeof d.adminNote !== 'string' || d.adminNote.length > 1000) return false;
  }
  return true;
}

export async function createLeaveAction(
  dto: CreateLeaveRequestDto
): Promise<ActionResult> {
  if (!isValidPositiveInt(dto.userId)) {
    return { success: false, message: 'Invalid employee.' };
  }
  if (!validateLeaveDto(dto)) {
    return { success: false, message: 'Invalid leave request data.' };
  }

  try {
    const permissions = await getLeavePermissions();
    if (!permissions.canCreate) {
      return { success: false, message: 'Access denied.' };
    }

    await leaveRequestsApi.create(dto);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[leave-actions] create failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/leave');
  return { success: true };
}

export async function updateLeaveAction(
  id: number,
  dto: UpdateLeaveRequestDto
): Promise<ActionResult> {
  if (!isValidPositiveInt(id)) {
    return { success: false, message: 'Invalid leave ID.' };
  }
  if (!validateLeaveDto(dto)) {
    return { success: false, message: 'Invalid leave request data.' };
  }

  try {
    const permissions = await getLeavePermissions();
    if (!permissions.canEditAll && !permissions.canEditOwn) {
      return { success: false, message: 'Access denied.' };
    }

    await leaveRequestsApi.update(id, dto);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[leave-actions] update failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/leave');
  return { success: true };
}

export async function deleteLeaveAction(id: number): Promise<ActionResult> {
  if (!isValidPositiveInt(id)) {
    return { success: false, message: 'Invalid leave ID.' };
  }

  try {
    const permissions = await getLeavePermissions();
    if (!permissions.canDelete && !permissions.canDeleteOwn) {
      return { success: false, message: 'Access denied.' };
    }

    await leaveRequestsApi.delete(id);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[leave-actions] delete failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/leave');
  return { success: true };
}

export async function approveLeaveAction(
  id: number,
  dto: ApproveLeaveRequestDto = {}
): Promise<ActionResult> {
  if (!isValidPositiveInt(id)) {
    return { success: false, message: 'Invalid leave ID.' };
  }
  if (!validateNoteDto(dto)) {
    return { success: false, message: 'Invalid note.' };
  }

  try {
    const permissions = await getLeavePermissions();
    if (!permissions.canApprove) {
      return { success: false, message: 'Access denied.' };
    }

    await leaveRequestsApi.approve(id, dto);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[leave-actions] approve failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/leave');
  return { success: true };
}

export async function rejectLeaveAction(
  id: number,
  dto: RejectLeaveRequestDto = {}
): Promise<ActionResult> {
  if (!isValidPositiveInt(id)) {
    return { success: false, message: 'Invalid leave ID.' };
  }
  if (!validateNoteDto(dto)) {
    return { success: false, message: 'Invalid note.' };
  }

  try {
    const permissions = await getLeavePermissions();
    if (!permissions.canReject) {
      return { success: false, message: 'Access denied.' };
    }

    await leaveRequestsApi.reject(id, dto);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[leave-actions] reject failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidatePath('/dashboard/leave');
  return { success: true };
}