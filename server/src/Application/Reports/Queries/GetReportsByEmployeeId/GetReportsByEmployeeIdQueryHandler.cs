using Application.Reports.DTOs;
using Application.Reports.Mappers;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Reports.Queries.GetReportsByEmployeeId;

public class GetReportsByEmployeeIdQueryHandler : IRequestHandler<GetReportsByEmployeeIdQuery, List<ReportDto>>
{
    private readonly IApplicationDbContext _context;

    public GetReportsByEmployeeIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ReportDto>> Handle(GetReportsByEmployeeIdQuery request, CancellationToken cancellationToken)
    {
        var reports = await _context.Reports
            .Include(r => r.Employee)
            .Where(r => r.EmployeeId == request.EmployeeId)
            .ToListAsync(cancellationToken);

        return reports.Select(r => r.ToDto()).ToList();
    }
}