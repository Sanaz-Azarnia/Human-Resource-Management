import { NextRequest, NextResponse } from 'next/server';
import { employeesApi } from '@/lib/api/endpoints/employees';
import { forwardAuthHeaders, handleApiError } from '@/lib/api/route-handler';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('search') ?? '';
    const headers = forwardAuthHeaders(request);
    const employees = await employeesApi.getAll(undefined, { headers });

    const query = search.trim().toLowerCase();

    if (!query) {
      return NextResponse.json(employees);
    }

    const filtered = employees.filter((employee) => {
      const values = [
        employee.firstname,
        employee.lastname,
        employee.personnelId,
        employee.nationalId,
        employee.email,
        employee.phone,
      ];

      return values.some((value) =>
        value?.toString().toLowerCase().includes(query)
      );
    });

    return NextResponse.json(filtered);
  } catch (error) {
    return handleApiError(error);
  }
}