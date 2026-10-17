namespace Application.Attendance.DTOs;

public class AttendanceSheetDto
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public bool IsActive { get; set; }
    public bool IsSubmitted { get; set; }
    public string UserStatus { get; set; } = "NotRecorded";
}