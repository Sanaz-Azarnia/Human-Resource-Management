using Application.Attendance.DTOs;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Attendance.Queries.GetDailyAttendanceReport;

public class GetDailyAttendanceReportQueryHandler : IRequestHandler<GetDailyAttendanceReportQuery, DailyAttendanceReportDto>
{
    private readonly IApplicationDbContext _context;

    public GetDailyAttendanceReportQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DailyAttendanceReportDto> Handle(GetDailyAttendanceReportQuery request, CancellationToken cancellationToken)
    {
        var targetDate = request.Date.Kind == DateTimeKind.Unspecified
            ? DateTime.SpecifyKind(request.Date.Date, DateTimeKind.Utc)
            : request.Date.Date.ToUniversalTime();

        var employees = await _context.Employees
            .OrderBy(e => e.Firstname)
            .ThenBy(e => e.Lastname)
            .ToListAsync(cancellationToken);

        var attendances = await _context.Attendances
            .Where(a => a.Date.Date == targetDate)
            .ToListAsync(cancellationToken);

        var report = new DailyAttendanceReportDto
        {
            Date = targetDate,
            TotalEmployees = employees.Count,
            Employees = new List<AttendanceSummaryDto>()
        };

        foreach (var employee in employees)
        {
            var attendance = attendances.FirstOrDefault(a => a.EmployeeId == employee.Id);

            if (attendance == null)
            {
                report.Employees.Add(new AttendanceSummaryDto
                {
                    EmployeeId = employee.Id,
                    EmployeeName = $"{employee.Firstname} {employee.Lastname}",
                    PersonnelId = employee.PersonnelId,
                    Status = "NotRecorded",
                    CheckIn = null,
                    CheckOut = null,
                    Notes = null
                });
                report.NotRecordedCount++;
            }
            else if (attendance.IsPresent)
            {
                report.Employees.Add(new AttendanceSummaryDto
                {
                    EmployeeId = employee.Id,
                    EmployeeName = $"{employee.Firstname} {employee.Lastname}",
                    PersonnelId = employee.PersonnelId,
                    Status = "Present",
                    CheckIn = attendance.CheckIn,
                    CheckOut = attendance.CheckOut,
                    Notes = attendance.Notes
                });
                report.PresentCount++;
            }
            else
            {
                report.Employees.Add(new AttendanceSummaryDto
                {
                    EmployeeId = employee.Id,
                    EmployeeName = $"{employee.Firstname} {employee.Lastname}",
                    PersonnelId = employee.PersonnelId,
                    Status = "Absent",
                    CheckIn = null,
                    CheckOut = null,
                    Notes = attendance.Notes
                });
                report.AbsentCount++;
            }
        }

        return report;
    }
}