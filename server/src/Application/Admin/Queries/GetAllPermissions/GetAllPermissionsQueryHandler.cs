 using Application.Admin.DTOs;
using Application.Admin.Mappers;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Admin.Queries.GetAllPermissions;

public class GetAllPermissionsQueryHandler : IRequestHandler<GetAllPermissionsQuery, List<PermissionDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllPermissionsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<PermissionDto>> Handle(GetAllPermissionsQuery request, CancellationToken cancellationToken)
    {
        var permissions = await _context.Permissions
            .ToListAsync(cancellationToken);

        return permissions.Select(p => p.ToDto()).ToList();
    }
}