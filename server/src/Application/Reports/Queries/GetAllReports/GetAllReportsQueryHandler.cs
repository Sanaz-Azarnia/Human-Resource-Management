using Application.Reports.DTOs;
using Application.Reports.Mappers;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Reports.Queries.GetAllReports;

public class GetAllReportsQueryHandler : IRequestHandler<GetAllReportsQuery, List<ReportDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllReportsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ReportDto>> Handle(GetAllReportsQuery request, CancellationToken cancellationToken)
    {
        var reports = await _context.Reports
            .Include(r => r.Employee)
            .ToListAsync(cancellationToken);

        return reports.Select(r => r.ToDto()).ToList();
    }
}