using Application.Attendance.DTOs;
using MediatR;

namespace Application.Attendance.Queries.GetAllAttendance;

public class GetAllAttendanceQuery : IRequest<List<AttendanceDto>>
{
}