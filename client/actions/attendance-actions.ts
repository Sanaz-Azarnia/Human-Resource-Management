'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { attendanceApi, isApiError } from '@/lib/api';
import { getAttendancePermissions } from '@/lib/permissions';
import {
  isValidPositiveInt,
  rethrowIfRedirect,
  type ActionResult,
} from './utils';
import type {
  CreateAttendanceDto,
  UpdateAttendanceDto,
  CreateAttendanceSheetDto,
  SubmitAttendanceDto
} from '@/lib/api/types';

function isValidDateString(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > 50) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

function isValidTime(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  if (value === '') return true;
  return /^([01]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value);
}

function validateAttendanceDto(dto: unknown): dto is CreateAttendanceDto | UpdateAttendanceDto {
  if (!dto || typeof dto !== 'object') return false;
  const d = dto as Record<string, unknown>;

  if (d.sheetId !== undefined && !isValidPositiveInt(d.sheetId)) return false;
  if (d.date !== undefined && !isValidDateString(d.date)) return false;
  if (d.checkIn !== undefined && !isValidTime(d.checkIn)) return false;
  if (d.checkOut !== undefined && !isValidTime(d.checkOut)) return false;
  if (d.notes !== undefined && typeof d.notes !== 'string') return false;
  if (typeof d.notes === 'string' && d.notes.length > 500) return false;

  return true;
}

function revalidateAllAttendancePages() {
  revalidatePath('/dashboard/attendance');
  revalidatePath('/dashboard/attendance/report');
  revalidatePath('/dashboard/attendance/my-attendance');  
  revalidatePath('/dashboard');
}

export async function createAttendanceAction(
  dto: CreateAttendanceDto
): Promise<ActionResult> {
  if (!isValidPositiveInt(dto.sheetId)) {
    return { success: false, message: 'Invalid sheet ID.' };
  }
  if (!validateAttendanceDto(dto)) {
    return { success: false, message: 'Invalid attendance data.' };
  }

  try {
    const permissions = await getAttendancePermissions();
    if (!permissions.canCreate) {
      return { success: false, message: 'Access denied.' };
    }

    await attendanceApi.create(dto);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[attendance-actions] create failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidateAllAttendancePages();
  return { success: true };
}

export async function updateAttendanceAction(
  id: number,
  dto: UpdateAttendanceDto
): Promise<ActionResult> {
  if (!isValidPositiveInt(id)) {
    return { success: false, message: 'Invalid attendance ID.' };
  }
  if (!validateAttendanceDto(dto)) {
    return { success: false, message: 'Invalid attendance data.' };
  }

  try {
    const permissions = await getAttendancePermissions();
    if (!permissions.canEditAll && !permissions.canEditOwn) {
      return { success: false, message: 'Access denied.' };
    }

    await attendanceApi.update(id, dto);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[attendance-actions] update failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidateAllAttendancePages();
  return { success: true };
}

export async function deleteAttendanceAction(id: number): Promise<ActionResult> {
  if (!isValidPositiveInt(id)) {
    return { success: false, message: 'Invalid attendance ID.' };
  }

  try {
    const permissions = await getAttendancePermissions();
    if (!permissions.canDelete) {
      return { success: false, message: 'Access denied.' };
    }

    await attendanceApi.delete(id);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[attendance-actions] delete failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidateAllAttendancePages();
  return { success: true };
}

export async function presentAttendanceAction(id: number): Promise<ActionResult> {
  if (!isValidPositiveInt(id)) {
    return { success: false, message: 'Invalid attendance ID.' };
  }

  try {
    const permissions = await getAttendancePermissions();
    if (!permissions.canPresent) {
      return { success: false, message: 'Access denied.' };
    }

    await attendanceApi.present(id);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[attendance-actions] present failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidateAllAttendancePages();
  return { success: true };
}

export async function absentAttendanceAction(id: number): Promise<ActionResult> {
  if (!isValidPositiveInt(id)) {
    return { success: false, message: 'Invalid attendance ID.' };
  }

  try {
    const permissions = await getAttendancePermissions();
    if (!permissions.canAbsent) {
      return { success: false, message: 'Access denied.' };
    }

    await attendanceApi.absent(id);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[attendance-actions] absent failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidateAllAttendancePages();
  return { success: true };
}

export async function createAttendanceSheetAction(
  dto: CreateAttendanceSheetDto
): Promise<ActionResult> {
  if (!dto.date || !dto.title) {
    return { success: false, message: 'Date and Title are required.' };
  }

  try {
    const permissions = await getAttendancePermissions();
    if (!permissions.canCreate) {
      return { success: false, message: 'Access denied.' };
    }

    await attendanceApi.createSheet(dto);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[attendance-actions] createSheet failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidateAllAttendancePages();
  return { success: true };
}

export async function submitAttendanceAction(
  dto: SubmitAttendanceDto
): Promise<ActionResult> {
  if (!isValidPositiveInt(dto.sheetId)) {
    return { success: false, message: 'Invalid sheet ID.' };
  }

  try {
    await attendanceApi.submitAttendance(dto);
  } catch (error) {
    rethrowIfRedirect(error);
    if (isApiError(error) && error.status === 401) redirect('/login');
    console.error('[attendance-actions] submitAttendance failed:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }

  revalidateAllAttendancePages();
  return { success: true };
}