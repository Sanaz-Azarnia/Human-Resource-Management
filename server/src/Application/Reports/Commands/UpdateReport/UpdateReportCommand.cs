using Application.Reports.DTOs;
using MediatR;

namespace Application.Reports.Commands.UpdateReport;

public class UpdateReportCommand : IRequest<ReportDto>
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? AttachmentUrl { get; set; }
}