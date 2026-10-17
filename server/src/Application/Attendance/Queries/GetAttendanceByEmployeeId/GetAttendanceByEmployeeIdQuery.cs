using Application.Attendance.DTOs;
using MediatR;

namespace Application.Attendance.Queries.GetAttendanceByEmployeeId;

public class GetAttendanceByEmployeeIdQuery : IRequest<List<AttendanceDto>>
{
    public int EmployeeId { get; set; }

    public GetAttendanceByEmployeeIdQuery(int employeeId)
    {
        EmployeeId = employeeId;
    }
}