// app/dashboard/employees/page.tsx
import { redirect } from "next/navigation";
import Link from 'next/link';
import { Employee } from "@/lib/api/types";
import { getBasePermissions, getCurrentUserPersonnelId } from "@/lib/permissions";
import { employeesApi } from "@/lib/api";
import { isApiError } from "@/lib/api/http";
import ClientEmployeeList from "@/components/filters/ClientEmployeeList";

async function getEmployees(): Promise<Employee[]> {
  try {
    const data = await employeesApi.getAll();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (isApiError(error)) {
      if (error.status === 401) redirect("/login");
      if (error.status === 403 || error.status === 404) return [];
    }
    console.error("Employees fetch error:", error);
    return [];
  }
}

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const [employees, permissions] = await Promise.all([
    getEmployees(),
    getBasePermissions('employee'),
  ]);

  if (!permissions.canViewAll && !permissions.canViewOwn) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied.</h1>
        <p>You don't have permission to view employees.</p>
      </div>
    );
  }

  const currentUserPersonnelId = await getCurrentUserPersonnelId();

  const accessibleEmployees = permissions.canViewAll
    ? employees
    : employees.filter(e => e.personnelId === currentUserPersonnelId);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Employees</h1>
        {permissions.canCreate && (
          <Link
            href="/dashboard/employees/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base"
          >
            + New Employee
          </Link>
        )}
      </div>

      <ClientEmployeeList
        employees={accessibleEmployees}
        permissions={permissions}
        currentUserPersonnelId={currentUserPersonnelId}
        initialSearchParams={params}
      />
    </div>
  );
}