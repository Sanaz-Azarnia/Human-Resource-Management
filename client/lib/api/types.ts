export interface ActionResult {
  success: boolean;
  message?: string;
}

export interface Employee {
  id: number;
  firstname: string;
  lastname: string;
  personnelId: string;
  nationalId: string;
  email: string;
  phone: string;
  address: string;
  roleName: string;
  avatarUrl: string;
  baseSalary: number;
  createdAt: string;
}

export interface Attendance {
  id: number;
  sheetId: number;  
  userId: number;
  name: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  isPresent: boolean;
  notes?: string;
}

export interface LeaveRequest {
  id: number;
  userId: number;
  name: string;
  title: string;
  reason: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
  adminNote?: string;
  createdAt: string;
}

export interface Payroll {
  id: number;
  userId: number;
  employeeName: string;
  year: string;
  month: string;
  baseSalary: number;
  overTime: number;
  bonus: number;
  tax: number;
  insurance: number;
  grossSalary: number;
  totalDeduction: number;
  netSalary: number;
  createdAt: string;
  isPaid: boolean;
}

export interface Report {
  id: number;
  userId: number;
  employeeName: string;
  title: string;
  content: string;
  type: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface Permission {
  id: number;
  name: string;
}

export interface BasePermissions {
  canViewAll: boolean;
  canViewOwn: boolean;
  canCreate: boolean;
  canEditAll: boolean;
  canEditOwn: boolean;
  canDelete: boolean;
}

export interface AttendancePermissions extends BasePermissions {
  canPresent: boolean;
  canAbsent: boolean;
}

export interface LeavePermissions extends BasePermissions {
  canApprove: boolean;
  canReject: boolean;
  canDeleteOwn: boolean;
}

export interface ReportPermissions extends BasePermissions {
  canDeleteOwn: boolean;
}

export type FeaturePermissions =
  | BasePermissions
  | AttendancePermissions
  | LeavePermissions
  | ReportPermissions;

export type UserPermissions = Record<string, FeaturePermissions>;

export interface GetEmployeesParams {
  search?: string;
}

export interface CreateEmployeeDto {
  firstname: string;
  lastname: string;
  personnelId: string;
  nationalId: string;
  email: string;
  phone: string;
  address: string;
  roleId: number;
  password: string;
  avatarUrl?: string;
  baseSalary: number;
}

export type UpdateEmployeeDto = Partial<Omit<CreateEmployeeDto, 'password'>> & {
  password?: string;
};

export interface CreateAttendanceDto {
  sheetId: number;
  date: string;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}

export type UpdateAttendanceDto = Partial<CreateAttendanceDto>;

export interface CreateLeaveRequestDto {
  userId: number;
  title: string;
  reason: string;
  startDate: string;
  endDate: string;
  type: string;
  adminNote?: string;
}

export type UpdateLeaveRequestDto = Partial<CreateLeaveRequestDto>;

export interface ApproveLeaveRequestDto {
  adminNote?: string;
}

export interface RejectLeaveRequestDto {
  adminNote?: string;
}

export interface CreatePayrollDto {
  userId: number;
  year: number;
  month: number;
  baseSalary: number;
  overTime?: number;
  bonus?: number;
  tax?: number;
  insurance?: number;
  grossSalary?: number;
  totalDeduction?: number;
  netSalary?: number;
  isPaid?: boolean;
}

export type UpdatePayrollDto = Partial<CreatePayrollDto>;

export interface CreateReportDto {
  userId: number;
  title: string;
  content: string;
  type: string;
  attachmentUrl?: string;
}

export type UpdateReportDto = Partial<CreateReportDto>;

export interface CreateRoleDto {
  name: string;
}

export interface AssignPermissionsDto {
  permissionIds: number[];
}

export interface ChangeEmployeeRoleDto {
  roleId: number;
}

export interface EmployeeFormFieldsProps {
  defaultValues?: {
    firstname?: string;
    lastname?: string;
    personnelId?: string;
    nationalId?: string;
    email?: string;
    phone?: string;
    address?: string;
    roleId?: number;
    roleName?: string;
    avatarUrl?: string;
    baseSalary?: number;
  };
}

export interface AttendanceFormFieldsProps {
  defaultValues?: {
    name?: string;
    date?: string;
    checkIn?: string;
    checkOut?: string;
    notes?: string;
  };
}

export interface LeaveRequestFormFieldsProps {
  defaultValues?: {
    name?: string;
    title?: string;
    reason?: string;
    startDate?: string;
    endDate?: string;
    type?: string;
    status?: string;
    adminNote?: string;
  };
  userId?: number;
}

export interface PayrollFormFieldsProps {
  defaultValues?: {
    employeeId?: number;
    employeeName?: string;
    year?: number;
    month?: number;
    baseSalary?: number;
    overTime?: number;
    bonus?: number;
    tax?: number;
    insurance?: number;
    isPaid?: boolean;
  };
  employees?: Employee[];
}

export interface ReportFormFieldsProps {
  defaultValues?: {
    employeeName?: string;
    title?: string;
    content?: string;
    type?: string;
    attachmentUrl?: string;
  };
  userId?: number;
}

export interface CreateModalProps {
  title: string;
  action: (formData: FormData) => Promise<ActionResult>;
  redirectPath: string;
  children: React.ReactNode;
  onSubmit?: (formData: FormData) => Record<string, any>;
}

export interface EditModalProps {
  title: string;
  action: (formData: FormData) => Promise<ActionResult>;
  redirectPath: string;
  data: any;
  children: React.ReactNode;
}

export interface DeleteButtonProps {
  action: () => Promise<ActionResult>;
  confirmMessage?: string;
  redirectPath?: string;
}

export interface CurrentUser {
  userId: number;
  personnelId: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  roleId?: number;
  roleName?: string;
  permissions: string[];
}

export interface AttendanceSummary {
  employeeId: number;
  employeeName: string;
  personnelId: string;
  status: 'Present' | 'Absent' | 'NotRecorded';
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}

export interface DailyAttendanceReport {
  date: string;
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  notRecordedCount: number;
  employees: AttendanceSummary[];
}

export interface AttendanceSheet {
  id: number;
  date: string;
  title: string;
  notes?: string;
  isActive: boolean;
  isSubmitted: boolean;
  userStatus: 'Present' | 'Absent' | 'NotRecorded';
}

export interface CreateAttendanceSheetDto {
  date: string;
  title: string;
  notes?: string;
}

export interface SubmitAttendanceDto {
  sheetId: number;
  isPresent: boolean;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}