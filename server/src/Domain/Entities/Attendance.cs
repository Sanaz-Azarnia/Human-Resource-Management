using Domain.Common;

namespace Domain.Entities;

public class Attendance : BaseEntity
{
    public int SheetId { get; private set; }  
    public AttendanceSheet? Sheet { get; private set; } 

    public int EmployeeId { get; private set; }
    public Employee? Employee { get; private set; }
    
    public DateTime Date { get; private set; }
    public TimeSpan? CheckIn { get; private set; }
    public TimeSpan? CheckOut { get; private set; }
    public bool IsPresent { get; private set; }
    public string? Notes { get; private set; }

    protected Attendance() { }

    
    public static Attendance Create(int sheetId, int employeeId, DateTime date)
    {
        return new Attendance
        {
            SheetId = sheetId,
            EmployeeId = employeeId,
            Date = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc),
            IsPresent = false 
        };
    }

    public void RecordCheckIn(TimeSpan checkInTime)
    {
        CheckIn = checkInTime;
        IsPresent = true;
    }

    public void RecordCheckOut(TimeSpan checkOutTime)
    {
        if (CheckIn == null) throw new DomainException("Cannot check out before checking in.");
        CheckOut = checkOutTime;
    }

    public void MarkAsPresent() => IsPresent = true;

    public void MarkAsAbsent(string? reason = null)
    {
        IsPresent = false;
        CheckIn = null;
        CheckOut = null;
        if (!string.IsNullOrEmpty(reason)) Notes = reason;
    }
    
    public void UpdateNotes(string? notes) => Notes = notes;
}