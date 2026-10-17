import type { ActionResult } from '@/actions/utils';

export interface CreateModalProps {
  title: string;
  action: (formData: FormData) => Promise<ActionResult>;
  redirectPath: string;
  children: React.ReactNode;
  onSubmit?: (formData: FormData) => Record<string, any>;
}