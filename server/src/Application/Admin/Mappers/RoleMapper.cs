using Application.Admin.DTOs;
using Domain.Entities;

namespace Application.Admin.Mappers;

public static class RoleMapper
{
    public static RoleDto ToDto(this Role role)
    {
        return new RoleDto
        {
            Id = role.Id,
            Name = role.Name,
            Description = role.Description,
            IsActive = role.IsActive,
            Permissions = role.RolePermissions
                .Select(rp => rp.Permission?.Name ?? string.Empty)
                .ToList()
        };
    }
}