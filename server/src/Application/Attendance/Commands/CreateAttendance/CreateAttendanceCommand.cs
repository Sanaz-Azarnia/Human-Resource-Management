using Application.Attendance.DTOs;
using MediatR;

namespace Application.Attendance.Commands.CreateAttendance;

public class CreateAttendanceCommand : IRequest<AttendanceDto>
{
    public int SheetId { get; set; }   
    public TimeSpan? CheckIn { get; set; }
    public TimeSpan? CheckOut { get; set; }
    public string? Notes { get; set; }
}