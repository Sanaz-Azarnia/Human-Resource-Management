using Application.Payrolls.DTOs;
using Application.Payrolls.Mappers;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Payrolls.Queries.GetPayrollById;

public class GetPayrollByIdQueryHandler : IRequestHandler<GetPayrollByIdQuery, PayrollDto>
{
    private readonly IApplicationDbContext _context;

    public GetPayrollByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PayrollDto> Handle(GetPayrollByIdQuery request, CancellationToken cancellationToken)
    {
        var payroll = await _context.Payrolls
            .Include(p => p.Employee)
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (payroll == null)
            throw new NotFoundException("Payroll", request.Id);

        return payroll.ToDto();
    }
}