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
  }
  
   