import { apiFetch } from '../http';
import type {
  Attendance,
  AttendanceSheet,
  CreateAttendanceDto,
  CreateAttendanceSheetDto,
  UpdateAttendanceDto,
  DailyAttendanceReport,
  SubmitAttendanceDto,
} from '../types';

export const attendanceApi = {
  getAll(init?: RequestInit) {
    return apiFetch<Attendance[]>('/api/attendance', init);
  },

  getById(id: number, init?: RequestInit) {
    return apiFetch<Attendance>(`/api/attendance/${id}`, init);
  },

  getByEmployeeId(employeeId: number, init?: RequestInit) {
    return apiFetch<Attendance[]>(`/api/attendance/employee/${employeeId}`, init);
  },

  create(dto: CreateAttendanceDto, init?: RequestInit) {
    return apiFetch<Attendance>('/api/attendance', {
      ...init,
      method: 'POST',
      body: dto,
    });
  },

  update(id: number, dto: UpdateAttendanceDto, init?: RequestInit) {
    return apiFetch<Attendance>(`/api/attendance/${id}`, {
      ...init,
      method: 'PUT',
      body: dto,
    });
  },

  delete(id: number, init?: RequestInit) {
    return apiFetch<void>(`/api/attendance/${id}`, {
      ...init,
      method: 'DELETE',
    });
  },

  present(id: number, init?: RequestInit) {
    return apiFetch<Attendance>(`/api/attendance/${id}/present`, {
      ...init,
      method: 'PUT',
    });
  },

  absent(id: number, init?: RequestInit) {
    return apiFetch<Attendance>(`/api/attendance/${id}/absent`, {
      ...init,
      method: 'PUT',
    });
  },

  getDailyReport(date: string, init?: RequestInit) {
    return apiFetch<DailyAttendanceReport>(
      `/api/attendance/report?date=${encodeURIComponent(date)}`,
      init
    );
  },

  
  getAllSheets(init?: RequestInit) {
    return apiFetch<AttendanceSheet[]>('/api/attendance/sheets', init);
  },

   
  getActiveSheets(init?: RequestInit) {
    return apiFetch<AttendanceSheet[]>('/api/attendance/sheets/active', init);
  },

   
  createSheet(dto: CreateAttendanceSheetDto, init?: RequestInit) {
    return apiFetch<number>('/api/attendance/sheets', {
      ...init,
      method: 'POST',
      body: dto,
    });
  },

   
  submitAttendance(dto: SubmitAttendanceDto, init?: RequestInit) {
    return apiFetch<boolean>('/api/attendance/submit', {
      ...init,
      method: 'POST',
      body: dto,
    });
  },

   
  getSheetReport(sheetId: number, init?: RequestInit) {
    return apiFetch<DailyAttendanceReport>(
      `/api/attendance/sheets/${sheetId}/report`,
      init
    );
  },
};