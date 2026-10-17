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

export interface ReportFormFieldsProps{
    defaultValues?: {
        employeeName?: string;
        title?: string;
        content?: string;
        type?: string;
        attachmentUrl?: string;

    };
   
}