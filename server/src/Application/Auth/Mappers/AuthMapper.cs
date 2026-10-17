using Application.Auth.DTOs;
using Domain.Entities;

namespace Application.Auth.Mappers;

public static class AuthMapper
{
    public static AuthResponseDto ToAuthResponse(this Employee employee, List<string> permissions, string token)
    {
        return new AuthResponseDto
        {
            Token = token,
            UserId = employee.Id,
            Firstname = employee.Firstname,
            Lastname = employee.Lastname,
            RoleId = employee.RoleId,
            AvatarUrl = employee.AvatarUrl,
            Permissions = permissions
        };
    }

    public static UserProfileDto ToUserProfile(this Employee employee, List<string> permissions)
    {
        return new UserProfileDto
        {
            UserId = employee.Id,
            Firstname = employee.Firstname,
            Lastname = employee.Lastname,
            RoleId = employee.RoleId,
            PersonnelId = employee.PersonnelId,
            AvatarUrl = employee.AvatarUrl,
            Permissions = permissions
        };
    }
}