using Application.Payrolls.DTOs;
using Application.Payrolls.Mappers;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Payrolls.Commands.UpdatePayroll;

public class UpdatePayrollCommandHandler : IRequestHandler<UpdatePayrollCommand, PayrollDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IPermissionService _permissionService;

    public UpdatePayrollCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IPermissionService permissionService)
    {
        _context = context;
        _currentUser = currentUser;
        _permissionService = permissionService;
    }

    public async Task<PayrollDto> Handle(UpdatePayrollCommand request, CancellationToken cancellationToken)
    {
        var payroll = await _context.Payrolls
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (payroll == null)
            throw new NotFoundException("Payroll", request.Id);

        // بررسی دسترسی
        bool isOwner = payroll.EmployeeId == _currentUser.UserId;
        bool canEditAll = await _permissionService.HasPermissionAsync(_currentUser.UserId, "payroll:edit:all");
        bool canEditOwn = await _permissionService.HasPermissionAsync(_currentUser.UserId, "payroll:edit:own");

        if (!isOwner && !canEditAll)
            throw new ForbiddenException("You don't have permission to edit this payroll");

        if (isOwner && !canEditOwn && !canEditAll)
            throw new ForbiddenException("You don't have permission to edit your own payroll");

        // آپدیت با Rich Model
        payroll.UpdateDetails(
            baseSalary: request.BaseSalary,
            overtime: request.Overtime,
            bonus: request.Bonus,
            tax: request.Tax,
            insurance: request.Insurance
        );

        // آپدیت وضعیت پرداخت
        if (request.IsPaid)
        {
            payroll.MarkAsPaid();
        }

        await _context.SaveChangesAsync(cancellationToken);

        // بارگذاری مجدد
        var result = await _context.Payrolls
            .Include(p => p.Employee)
            .FirstAsync(p => p.Id == payroll.Id, cancellationToken);

        return result.ToDto();
    }
}