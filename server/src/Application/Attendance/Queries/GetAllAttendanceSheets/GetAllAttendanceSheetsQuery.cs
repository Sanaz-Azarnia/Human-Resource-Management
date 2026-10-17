using Application.Attendance.DTOs;
using MediatR;

namespace Application.Attendance.Queries.GetAllAttendanceSheets;

public class GetAllAttendanceSheetsQuery : IRequest<List<AttendanceSheetDto>>
{
}