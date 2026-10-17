using Application.Reports.DTOs;
using Domain.Entities;

namespace Application.Reports.Mappers;

public static class ReportMapper
{
    public static ReportDto ToDto(this Report report)
    {
        return new ReportDto
        {
            Id = report.Id,
            UserId = report.EmployeeId,
            Name = report.Employee != null
                ? $"{report.Employee.Firstname} {report.Employee.Lastname}"
                : string.Empty,
            Title = report.Title,
            Content = report.Content,
            Type = report.Type,
            AttachmentUrl = report.AttachmentUrl,
            CreatedAt = report.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss")
        };
    }
}