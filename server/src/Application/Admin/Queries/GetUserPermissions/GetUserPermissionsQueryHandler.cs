using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Admin.Queries.GetUserPermissions;

public class GetUserPermissionsQueryHandler : IRequestHandler<GetUserPermissionsQuery, List<string>>
{
    private readonly IApplicationDbContext _context;

    public GetUserPermissionsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<string>> Handle(GetUserPermissionsQuery request, CancellationToken cancellationToken)
    {
        var permissions = await _context.Employees
            .Where(e => e.Id == request.EmployeeId)
            .SelectMany(e => e.Role!.RolePermissions)
            .Select(rp => rp.Permission!.Name)
            .ToListAsync(cancellationToken);

        return permissions;
    }
}