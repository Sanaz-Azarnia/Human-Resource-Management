using Application.Admin.DTOs;
using Domain.Entities;

namespace Application.Admin.Mappers;

public static class PermissionMapper
{
    public static PermissionDto ToDto(this Permission permission)
    {
        return new PermissionDto
        {
            Id = permission.Id,
            Name = permission.Name,
            Description = permission.Description
        };
    }
}