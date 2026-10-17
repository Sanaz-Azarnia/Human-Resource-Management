using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Employees.Commands.DeleteEmployee;

public class DeleteEmployeeCommandHandler : IRequestHandler<DeleteEmployeeCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IPermissionService _permissionService;

    public DeleteEmployeeCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IPermissionService permissionService)
    {
        _context = context;
        _currentUser = currentUser;
        _permissionService = permissionService;
    }

    public async Task<bool> Handle(DeleteEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

        if (employee == null)
            throw new NotFoundException("Employee", request.Id);

        // بررسی دسترسی حذف
        bool canDelete = await _permissionService.HasPermissionAsync(_currentUser.UserId, "employee:delete");
        if (!canDelete)
            throw new ForbiddenException("You don't have permission to delete employees");

        _context.Employees.Remove(employee);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}