import type { ActionResult } from '@/actions/utils';

export interface DeleteButtonProps {
  action: () => Promise<ActionResult>;
  confirmMessage?: string;
  redirectPath?: string;
}