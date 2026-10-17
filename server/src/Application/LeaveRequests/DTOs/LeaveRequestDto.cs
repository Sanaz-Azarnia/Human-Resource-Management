namespace Application.LeaveRequests.DTOs;

public class LeaveRequestDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? AdminNote { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
}

 