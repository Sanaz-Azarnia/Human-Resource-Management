using Application.Reports.DTOs;
using Application.Reports.Mappers;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Reports.Queries.GetReportById;

public class GetReportByIdQueryHandler : IRequestHandler<GetReportByIdQuery, ReportDto>
{
    private readonly IApplicationDbContext _context;

    public GetReportByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ReportDto> Handle(GetReportByIdQuery request, CancellationToken cancellationToken)
    {
        var report = await _context.Reports
            .Include(r => r.Employee)
            .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

        if (report == null)
            throw new NotFoundException("Report", request.Id);

        return report.ToDto();
    }
}