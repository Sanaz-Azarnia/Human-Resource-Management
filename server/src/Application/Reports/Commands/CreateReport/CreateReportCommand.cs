using Application.Reports.DTOs;
using MediatR;

namespace Application.Reports.Commands.CreateReport;

public class CreateReportCommand : IRequest<ReportDto>
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? AttachmentUrl { get; set; }
}