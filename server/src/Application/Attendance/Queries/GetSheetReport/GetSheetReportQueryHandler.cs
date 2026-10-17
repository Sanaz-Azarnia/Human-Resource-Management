using Application.Attendance.DTOs;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Attendance.Queries.GetSheetReport;

public class GetSheetReportQueryHandler : IRequestHandler<GetSheetReportQuery, DailyAttendanceReportDto>
{
    private readonly IApplicationDbContext _context;

    public GetSheetReportQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DailyAttendanceReportDto> Handle(GetSheetReportQuery request, CancellationToken cancellationToken)
    {
        var sheet = await _context.AttendanceSheets
            .FirstOrDefaultAsync(s => s.Id == request.SheetId, cancellationToken);

        if (sheet == null)
            throw new NotFoundException("AttendanceSheet", request.SheetId);

        var employees = await _context.Employees
            .OrderBy(e => e.Firstname)
            .ThenBy(e => e.Lastname)
            .ToListAsync(cancellationToken);

        var attendances = await _context.Attendances
            .Where(a => a.SheetId == request.SheetId)
            .ToListAsync(cancellationToken);

        var report = new DailyAttendanceReportDto
        {
            Date = sheet.Date,
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