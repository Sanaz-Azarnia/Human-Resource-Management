using Application.Payrolls.DTOs;
using Application.Payrolls.Mappers;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Payrolls.Queries.GetPayrollsByEmployeeId;

public class GetPayrollsByEmployeeIdQueryHandler : IRequestHandler<GetPayrollsByEmployeeIdQuery, List<PayrollDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPayrollsByEmployeeIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PayrollDto>> Handle(GetPayrollsByEmployeeIdQuery request, CancellationToken cancellationToken)
    {
        var payrolls = await _context.Payrolls
            .Include(p => p.Employee)
            .Where(p => p.EmployeeId == request.EmployeeId)
            .ToListAsync(cancellationToken);

        return payrolls.Select(p => p.ToDto()).ToList();
    }
}