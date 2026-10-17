using Domain.Common;

namespace Domain.Entities;

public class AttendanceSheet : BaseEntity
{
    public DateTime Date { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string? Notes { get; private set; }
    public int CreatedByAdminId { get; private set; }
    public bool IsActive { get; private set; }
    
    public ICollection<Attendance> Attendances { get; private set; } = new List<Attendance>();

    protected AttendanceSheet() { }

    public static AttendanceSheet Create(DateTime date, string title, string? notes, int adminId)
    {
        return new AttendanceSheet
        {
            Date = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc),
            Title = title,
            Notes = notes,
            CreatedByAdminId = adminId,
            IsActive = true
        };
    }

    public void Close() => IsActive = false;
}