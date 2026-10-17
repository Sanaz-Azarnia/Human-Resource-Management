export interface Attendance {
    id: number;
    userId: number;
    name: string;
    date: string;
    checkIn?: string;
    checkOut?: string;
    isPresent: boolean;
    notes?: string;
}

export interface AttendanceFormFieldsProps {
    defaultValues?: {
        name: string;
        date: string;
        checkIn?: string;
        checkOut?: string;
        isPresent: boolean;
        notes?: string;

    }
    
}