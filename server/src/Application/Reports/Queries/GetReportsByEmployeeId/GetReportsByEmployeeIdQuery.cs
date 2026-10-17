using Application.Reports.DTOs;
using MediatR;

namespace Application.Reports.Queries.GetReportsByEmployeeId;

public class GetReportsByEmployeeIdQuery : IRequest<List<ReportDto>>
{
    public int EmployeeId { get; set; }

    public GetReportsByEmployeeIdQuery(int employeeId)
    {
        EmployeeId = employeeId;
    }
}