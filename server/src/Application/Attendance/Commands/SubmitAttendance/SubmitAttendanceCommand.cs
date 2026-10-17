using MediatR;

namespace Application.Attendance.Commands.SubmitAttendance;

public class SubmitAttendanceCommand : IRequest<bool>
{
    public int SheetId { get; set; }
    public bool IsPresent { get; set; }
    public TimeSpan? CheckIn { get; set; }
    public TimeSpan? CheckOut { get; set; }
    public string? Notes { get; set; }
}