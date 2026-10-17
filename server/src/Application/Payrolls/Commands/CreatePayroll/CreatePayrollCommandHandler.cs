using Application.Payrolls.DTOs;
using Application.Payrolls.Mappers;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Payrolls.Commands.CreatePayroll;

public class CreatePayrollCommandHandler : IRequestHandler<CreatePayrollCommand, PayrollDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public CreatePayrollCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<PayrollDto> Handle(CreatePayrollCommand request, CancellationToken cancellationToken)
    {
        // ساخت فیش حقوقی با Rich Model
        var payroll = Domain.Entities.Payroll.Create(
            employeeId: _currentUser.UserId,
            year: request.Year,
            month: request.Month,
            baseSalary: request.BaseSalary,
            overtime: request.Overtime,
            bonus: request.Bonus,
            tax: request.Tax,
            insurance: request.Insurance
        );

        // اگر در درخواست اولیه وضعیت پرداخت مشخص شده
        if (request.IsPaid)
        {
            payroll.MarkAsPaid();
        }

        _context.Payrolls.Add(payroll);
        await _context.SaveChangesAsync(cancellationToken);

        // بارگذاری مجدد با Employee
        var result = await _context.Payrolls
            .Include(p => p.Employee)
            .FirstAsync(p => p.Id == payroll.Id, cancellationToken);

        return result.ToDto();
    }
}