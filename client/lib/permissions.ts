// lib/permissions.ts
import { cache } from 'react';
import { authApi } from '@/lib/api';
import type {
  BasePermissions,
  AttendancePermissions,
  LeavePermissions,
  ReportPermissions,
  CurrentUser,
} from '@/lib/api/types';

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  try {
    return await authApi.me();
  } catch (error) {
    console.error('[permissions] getCurrentUser failed:', error);
    return null;
  }
});

 
const getPermissionsList = cache(async (): Promise<string[]> => {
  const user = await getCurrentUser();
  return user?.permissions ?? [];
});

 
export async function getBasePermissions(
  feature: 'employee' | 'payroll'
): Promise<BasePermissions> {
  const perms = await getPermissionsList();

  return {
    canViewAll: perms.includes(`${feature}:view:all`),
    canViewOwn: perms.includes(`${feature}:view:own`),
    canCreate: perms.includes(`${feature}:create`),
    canEditAll: perms.includes(`${feature}:edit:all`),
    canEditOwn: perms.includes(`${feature}:edit:own`),
    canDelete: perms.includes(`${feature}:delete`),
  };
}

export async function getAttendancePermissions(): Promise<AttendancePermissions> {
  const perms = await getPermissionsList();

  return {
    canViewAll: perms.includes('attendance:view:all'),
    canViewOwn: perms.includes('attendance:view:own'),
    canCreate: perms.includes('attendance:create'),
    canEditAll: perms.includes('attendance:edit:all'),
    canEditOwn: perms.includes('attendance:edit:own'),
    canDelete: perms.includes('attendance:delete'),
    canPresent: perms.includes('attendance:present'),
    canAbsent: perms.includes('attendance:absent'),
  };
}

export async function getLeavePermissions(): Promise<LeavePermissions> {
  const perms = await getPermissionsList();

  return {
    canViewAll: perms.includes('leaveRequest:view:all'),
    canViewOwn: perms.includes('leaveRequest:view:own'),
    canCreate: perms.includes('leaveRequest:create'),
    canEditAll: perms.includes('leaveRequest:edit:all'),
    canEditOwn: perms.includes('leaveRequest:edit:own'),
    canDelete: perms.includes('leaveRequest:delete'),
    canApprove: perms.includes('leaveRequest:approve'),
    canReject: perms.includes('leaveRequest:reject'),
    canDeleteOwn: perms.includes('leaveRequest:delete:own'),
  };
}

export async function getReportPermissions(): Promise<ReportPermissions> {
  const perms = await getPermissionsList();

  return {
    canViewAll: perms.includes('report:view:all'),
    canViewOwn: perms.includes('report:view:own'),
    canCreate: perms.includes('report:create'),
    canEditAll: perms.includes('report:edit:all'),
    canEditOwn: perms.includes('report:edit:own'),
    canDelete: perms.includes('report:delete'),
    canDeleteOwn: perms.includes('report:delete:own'),
  };
}

 
export async function getCurrentUserPersonnelId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.personnelId ?? null;
}

 
export async function getCurrentUserEmployeeId(): Promise<number | null> {
  const user = await getCurrentUser();
  return user?.userId ?? null;
}