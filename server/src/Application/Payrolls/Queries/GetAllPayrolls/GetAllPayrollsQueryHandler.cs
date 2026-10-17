using Application.Payrolls.DTOs;
using Application.Payrolls.Mappers;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Payrolls.Queries.GetAllPayrolls;

public class GetAllPayrollsQueryHandler : IRequestHandler<GetAllPayrollsQuery, List<PayrollDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllPayrollsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PayrollDto>> Handle(GetAllPayrollsQuery request, CancellationToken cancellationToken)
    {
        var payrolls = await _context.Payrolls
            .Include(p => p.Employee)
            .ToListAsync(cancellationToken);

        return payrolls.Select(p => p.ToDto()).ToList();
    }
}