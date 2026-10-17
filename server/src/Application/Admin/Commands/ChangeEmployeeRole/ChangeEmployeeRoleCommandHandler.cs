using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Admin.Commands.ChangeEmployeeRole;

public class ChangeEmployeeRoleCommandHandler : IRequestHandler<ChangeEmployeeRoleCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public ChangeEmployeeRoleCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(ChangeEmployeeRoleCommand request, CancellationToken cancellationToken)
    {
        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == request.EmployeeId, cancellationToken);

        if (employee == null)
            throw new NotFoundException("Employee", request.EmployeeId);

        var role = await _context.Roles
            .FirstOrDefaultAsync(r => r.Id == request.RoleId, cancellationToken);

        if (role == null)
            throw new NotFoundException("Role", request.RoleId);

        
        employee.ChangeRole(request.RoleId);

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}