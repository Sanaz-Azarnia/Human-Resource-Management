namespace Application.Attendance.DTOs;

public class DailyAttendanceReportDto
{
    public DateTime Date { get; set; }
    public int TotalEmployees { get; set; }
    public int PresentCount { get; set; }
    public int AbsentCount { get; set; }
    public int NotRecordedCount { get; set; }
    public List<AttendanceSummaryDto> Employees { get; set; } = new();
}

public class AttendanceSummaryDto
{
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string PersonnelId { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public TimeSpan? CheckIn { get; set; }
    public TimeSpan? CheckOut { get; set; }
    public string? Notes { get; set; }
}