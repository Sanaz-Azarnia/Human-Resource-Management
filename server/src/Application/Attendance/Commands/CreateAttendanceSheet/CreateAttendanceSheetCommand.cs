using MediatR;

namespace Application.Attendance.Commands.CreateAttendanceSheet;

public class CreateAttendanceSheetCommand : IRequest<int>
{
    public DateTime Date { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Notes { get; set; }
}