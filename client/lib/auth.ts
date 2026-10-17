import { getCurrentUser } from '@/lib/permissions';

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('No authenticated user');
  }

  return {
    'Content-Type': 'application/json',
  };
}

export function getBaseUrl(): string {
  const url = process.env.BACKEND_API_URL;

  if (!url) {
    throw new Error('BACKEND_API_URL is not defined in environment variables');
  }
  return url;
}