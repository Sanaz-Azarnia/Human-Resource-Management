import { NextRequest, NextResponse } from 'next/server';
import { employeesApi } from '@/lib/api/endpoints/employees';
import { forwardAuthHeaders, handleApiError } from '@/lib/api/route-handler';

export const dynamic = 'force-dynamic';

type RouteParams = {
  personnelId: string;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  try {
    const { personnelId } = await context.params;
    const headers = forwardAuthHeaders(request);

    const employee = await employeesApi.getByPersonnelId(personnelId, {
      headers,
    });

    return NextResponse.json(employee);
  } catch (error) {
    return handleApiError(error);
  }
}