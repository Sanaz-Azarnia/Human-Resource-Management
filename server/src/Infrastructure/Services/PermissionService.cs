 using Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Services;

public class PermissionService : IPermissionService
{
    private readonly IApplicationDbContext _context;

    public PermissionService(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HasPermissionAsync(int userId, string permission)
    {
        return await _context.Employees
            .Where(e => e.Id == userId)
            .SelectMany(e => e.Role!.RolePermissions)
            .Select(rp => rp.Permission!.Name)
            .AnyAsync(p => p == permission);
    }

    public async Task<List<string>> GetUserPermissionsAsync(int userId)
    {
        return await _context.Employees
            .Where(e => e.Id == userId)
            .SelectMany(e => e.Role!.RolePermissions)
            .Select(rp => rp.Permission!.Name)
            .ToListAsync();
    }
}