import type { ActionResult } from '@/actions/utils';

export interface EditModalProps {
  title: string;
  action: (formData: FormData) => Promise<ActionResult>;
  redirectPath: string;
  data: any;
  children: React.ReactNode;
}