namespace Application.Reports.DTOs;

public class ReportDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? AttachmentUrl { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
}