namespace Application.Reports.DTOs;

public class CreateReportDto
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? AttachmentUrl { get; set; }
}