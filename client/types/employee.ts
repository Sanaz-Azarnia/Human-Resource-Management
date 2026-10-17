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

export interface EmployeeFormFieldsProps {
    defaultValues?: {
    firstname: string;
    lastname: string;
    personnelId: string;
    nationalId: string;
    email: string;
    phone: string;
    address: string;
    roleName: string;
    avatarUrl?: string;
    baseSalary: number;

    }
}