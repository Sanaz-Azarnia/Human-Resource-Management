using Application.Attendance.DTOs;
using MediatR;

namespace Application.Attendance.Queries.GetAttendanceById;

public class GetAttendanceByIdQuery : IRequest<AttendanceDto>
{
    public int Id { get; set; }

    public GetAttendanceByIdQuery(int id)
    {
        Id = id;
    }
}