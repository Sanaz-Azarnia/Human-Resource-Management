using Application.Reports.DTOs;
using MediatR;

namespace Application.Reports.Queries.GetReportById;

public class GetReportByIdQuery : IRequest<ReportDto>
{
    public int Id { get; set; }

    public GetReportByIdQuery(int id)
    {
        Id = id;
    }
}