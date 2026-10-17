using Application.Attendance.DTOs;
using MediatR;

namespace Application.Attendance.Queries.GetActiveAttendanceSheets;

public class GetActiveAttendanceSheetsQuery : IRequest<List<AttendanceSheetDto>>
{
}