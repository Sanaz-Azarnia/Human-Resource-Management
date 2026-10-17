import 'server-only';
import { cookies } from 'next/headers';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public payload?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

const API_URL = process.env.BACKEND_API_URL;

export interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export function buildQueryString<T extends object>(
  params?: T
): string {
  if (!params) return '';

  const entries = Object.entries(params).filter(
    ([, value]) =>
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ''
  );

  if (entries.length === 0) return '';

  const searchParams = new URLSearchParams();

  for (const [key, value] of entries) {
    searchParams.set(key, String(value));
  }

  return `?${searchParams.toString()}`;
}

function getErrorMessageFromPayload(payload: any): string | null {
  if (!payload) return null;

  if (typeof payload === 'string') return payload;

  return (
    payload.message ||
    payload.title ||
    payload.error ||
    payload.detail ||
    (payload.errors ? JSON.stringify(payload.errors) : null)
  );
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { body, headers: inputHeaders, ...init } = options;

  const headers = new Headers(inputHeaders);

  const hasAuthFromInput = headers.has('authorization') || headers.has('cookie');

  if (!hasAuthFromInput) {
    const cookieStore = await cookies();

     
    const allCookies = cookieStore.getAll();
    if (allCookies.length > 0) {
      const cookieHeader = allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join('; ');
      headers.set('cookie', cookieHeader);
    }

     
    const token = cookieStore.get('token')?.value;
    if (token && !headers.has('authorization')) {
      headers.set('authorization', `Bearer ${token}`);
    }
  }

  if (!headers.has('accept')) {
    headers.set('accept', 'application/json');
  }

  let finalBody: BodyInit | undefined;

  if (body instanceof FormData) {
    finalBody = body;
    
  } else if (body !== undefined) {
    finalBody = JSON.stringify(body);
    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }
  }

  const url = `${API_URL}${path}`;

  const response = await fetch(url, {
    ...init,
    headers,
    body: finalBody,
    cache: init.cache ?? 'no-store',
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const message =
      getErrorMessageFromPayload(payload) ??
      `Request failed with status ${response.status}`;

    throw new ApiError(response.status, message, payload);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}