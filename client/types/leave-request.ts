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

export interface LeaveRequestFormFieldsProps {
    defaultValues?: {
        name: string;
        title: string;
        reason: string;
        startDate: string;
        endDate: string;
        type: string;
        status: string;
        adminNote?: string;

    }
    
    
}