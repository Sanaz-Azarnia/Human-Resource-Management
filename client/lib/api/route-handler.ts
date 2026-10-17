import 'server-only';
import { NextResponse } from 'next/server';
import { isApiError } from './http';

export function forwardAuthHeaders(request: Request): Headers {
  const headers = new Headers();

  const cookie = request.headers.get('cookie');
  if (cookie) {
    headers.set('cookie', cookie);
  }

  const authorization = request.headers.get('authorization');
  if (authorization) {
    headers.set('authorization', authorization);
  }

  return headers;
}

export function handleApiError(error: unknown): NextResponse {
  if (isApiError(error)) {
    return NextResponse.json(
      {
        message: error.message,
        details: error.payload,
      },
      { status: error.status }
    );
  }

  console.error(error);

  return NextResponse.json(
    { message: 'Internal server error.' },
    { status: 500 }
  );
}