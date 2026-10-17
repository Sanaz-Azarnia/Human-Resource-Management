namespace Application.Attendance.DTOs;

public class CreateAttendanceDto
{
    public DateTime Date { get; set; }
    public TimeSpan? CheckIn { get; set; }
    public TimeSpan? CheckOut { get; set; }
    public string? Notes { get; set; }
}