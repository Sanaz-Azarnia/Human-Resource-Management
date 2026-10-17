using Application.Reports.DTOs;
using MediatR;

namespace Application.Reports.Queries.GetAllReports;

public class GetAllReportsQuery : IRequest<List<ReportDto>>
{
}