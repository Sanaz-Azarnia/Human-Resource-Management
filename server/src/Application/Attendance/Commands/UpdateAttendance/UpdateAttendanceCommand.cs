using Application.Attendance.DTOs;
using MediatR;

namespace Application.Attendance.Commands.UpdateAttendance;

public class UpdateAttendanceCommand : IRequest<AttendanceDto>
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan? CheckIn { get; set; }
    public TimeSpan? CheckOut { get; set; }
    public string? Notes { get; set; }
}