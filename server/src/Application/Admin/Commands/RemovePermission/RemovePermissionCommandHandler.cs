using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Admin.Commands.RemovePermission;

public class RemovePermissionCommandHandler : IRequestHandler<RemovePermissionCommand, bool>
{
    private readonly IApplicationDbContext _context;

    public RemovePermissionCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> Handle(RemovePermissionCommand request, CancellationToken cancellationToken)
    {
        var role = await _context.Roles
            .Include(r => r.RolePermissions)
            .FirstOrDefaultAsync(r => r.Id == request.RoleId, cancellationToken);

        if (role == null)
            throw new NotFoundException("Role", request.RoleId);

         
        role.RemovePermission(request.PermissionId);

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}