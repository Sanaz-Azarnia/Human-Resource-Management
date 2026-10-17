using Application.Admin.DTOs;
using Application.Admin.Mappers;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Admin.Queries.GetAllRoles;

public class GetAllRolesQueryHandler : IRequestHandler<GetAllRolesQuery, List<RoleDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllRolesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<RoleDto>> Handle(GetAllRolesQuery request, CancellationToken cancellationToken)
    {
        var roles = await _context.Roles
            .Include(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
            .ToListAsync(cancellationToken);

        return roles.Select(r => r.ToDto()).ToList();
    }
}