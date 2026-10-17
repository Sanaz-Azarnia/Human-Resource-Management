using Domain.Common;

namespace Domain.Entities;

public class LeaveRequest : BaseEntity
{
    public int EmployeeId { get; private set; }
    public Employee? Employee { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Reason { get; private set; } = string.Empty;
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public string Type { get; private set; } = string.Empty;
    public string Status { get; private set; } = "Pending";
    public string? AdminNote { get; private set; }
    public DateTime CreatedAt { get; private set; }

    protected LeaveRequest() { }

    public static LeaveRequest Create(int employeeId, string title, string reason, DateTime startDate, DateTime endDate, string type)
    {
        if (endDate < startDate)
            throw new DomainException("End date must be greater than or equal to start date.");

        return new LeaveRequest
        {
            EmployeeId = employeeId,
            Title = title,
            Reason = reason,
            StartDate = DateTime.SpecifyKind(startDate.Date, DateTimeKind.Utc),
            EndDate = DateTime.SpecifyKind(endDate.Date, DateTimeKind.Utc),
            Type = type,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };
    }

    public void Approve(string? adminNote)
    {
        if (Status != "Pending")
            throw new DomainException("Only pending leave requests can be approved.");

        Status = "Approved";
        AdminNote = adminNote;
    }

    public void Reject(string? adminNote)
    {
        if (Status != "Pending")
            throw new DomainException("Only pending leave requests can be rejected.");

        Status = "Rejected";
        AdminNote = adminNote;
    }
    
    public void UpdateDetails(string title, string reason, DateTime startDate, DateTime endDate, string type)
    {
        if (Status != "Pending")
            throw new DomainException("Only pending leave requests can be updated.");
            
        if (endDate < startDate)
            throw new DomainException("End date must be greater than or equal to start date.");

        Title = title;
        Reason = reason;
        StartDate = DateTime.SpecifyKind(startDate.Date, DateTimeKind.Utc);
        EndDate = DateTime.SpecifyKind(endDate.Date, DateTimeKind.Utc);
        Type = type;
    }
}