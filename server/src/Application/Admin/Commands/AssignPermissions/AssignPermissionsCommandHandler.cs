using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Admin.Commands.AssignPermissions;

public class AssignPermissionsCommandHandler : IRequestHandler<AssignPermissionsCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public AssignPermissionsCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(AssignPermissionsCommand request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles
            .Include(r => r.RolePermissions)
            .FirstOrDefaultAsync(r => r.Id == request.RoleId, cancellationToken);

        if (role == null)
            throw new NotFoundException("Role", request.RoleId);

         
        foreach (var permissionId in request.PermissionIds)
        {
            role.AssignPermission(permissionId);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}