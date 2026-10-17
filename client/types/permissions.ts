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