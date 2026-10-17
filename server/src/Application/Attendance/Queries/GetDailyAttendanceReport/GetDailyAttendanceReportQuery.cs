using Application.Attendance.DTOs;
using MediatR;

namespace Application.Attendance.Queries.GetDailyAttendanceReport;

public class GetDailyAttendanceReportQuery : IRequest<DailyAttendanceReportDto>
{
    public DateTime Date { get; set; }
}