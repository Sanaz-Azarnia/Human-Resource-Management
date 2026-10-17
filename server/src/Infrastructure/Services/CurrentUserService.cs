using Application.Common.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Infrastructure.Services;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public int UserId
    {
        get
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User
                .FindFirstValue(ClaimTypes.NameIdentifier);
            return int.TryParse(userIdClaim, out int id) ? id : 0;
        }
    }

    public string PersonnelId
    {
        get
        {
            return _httpContextAccessor.HttpContext?.User
                .FindFirstValue("PersonnelId") ?? string.Empty;
        }
    }

    public string FullName
    {
        get
        {
            var firstname = _httpContextAccessor.HttpContext?.User
                .FindFirstValue(ClaimTypes.GivenName) ?? string.Empty;
            var lastname = _httpContextAccessor.HttpContext?.User
                .FindFirstValue(ClaimTypes.Surname) ?? string.Empty;
            return $"{firstname} {lastname}".Trim();
        }
    }

    public int RoleId
    {
        get
        {
            var roleIdClaim = _httpContextAccessor.HttpContext?.User
                .FindFirstValue("RoleId");
            return int.TryParse(roleIdClaim, out int id) ? id : 0;
        }
    }

    public bool IsAuthenticated =>
        _httpContextAccessor.HttpContext?.User.Identity?.IsAuthenticated ?? false;
}