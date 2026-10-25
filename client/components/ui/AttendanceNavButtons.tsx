import Link from "next/link";

type Props = {
  permissions: {
    canCreate: boolean;
    canViewAll: boolean;
  };
};

export default function AttendanceNavButtons({ permissions }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* New Sheet فقط برای کسی که canCreate دارد */}
      {permissions.canCreate && (
        <Link
          href="/dashboard/attendance/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Sheet
        </Link>
      )}

      {/* My Attendance برای همه */}
      <Link
        href="/dashboard/attendance/my-attendance"
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm md:text-base flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        My Attendance
      </Link>

      {/* Attendance Report فقط برای کسی که canViewAll دارد */}
      {permissions.canViewAll && (
        <Link
          href="/dashboard/attendance/report"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm md:text-base flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          Attendance Report
        </Link>
      )}
    </div>
  );
}