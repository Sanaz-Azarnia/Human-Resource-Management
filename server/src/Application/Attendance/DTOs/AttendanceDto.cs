namespace Application.Attendance.DTOs;

public class AttendanceDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string? CheckIn { get; set; }
    public string? CheckOut { get; set; }
    public bool IsPresent { get; set; }
    public string? Notes { get; set; }
}