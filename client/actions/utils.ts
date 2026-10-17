export function rethrowIfRedirect(error: unknown): void {
  if (
    error instanceof Error &&
    typeof (error as Error & { digest?: string }).digest === 'string' &&
    (error as Error & { digest?: string }).digest?.startsWith('NEXT_REDIRECT')
  ) {
    throw error;
  }
}

 
export function isValidPositiveInt(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value) && value > 0;
}

export type { ActionResult } from '@/lib/api/types';