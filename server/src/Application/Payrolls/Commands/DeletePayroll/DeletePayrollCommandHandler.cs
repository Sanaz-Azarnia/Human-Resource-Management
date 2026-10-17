using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Payrolls.Commands.DeletePayroll;

public class DeletePayrollCommandHandler : IRequestHandler<DeletePayrollCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IPermissionService _permissionService;

    public DeletePayrollCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IPermissionService permissionService)
    {
        _context = context;
        _currentUser = currentUser;
        _permissionService = permissionService;
    }

    public async Task<bool> Handle(DeletePayrollCommand request, CancellationToken cancellationToken)
    {
        var payroll = await _context.Payrolls
            .FirstOrDefaultAsync(p => p.Id == request.Id, cancellationToken);

        if (payroll == null)
            throw new NotFoundException("Payroll", request.Id);

        // بررسی دسترسی حذف
        bool canDelete = await _permissionService.HasPermissionAsync(_currentUser.UserId, "payroll:delete");
        if (!canDelete)
            throw new ForbiddenException("You don't have permission to delete payrolls");

        _context.Payrolls.Remove(payroll);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}