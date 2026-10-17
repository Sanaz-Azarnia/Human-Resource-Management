 using Application.Auth.DTOs;
using Application.Auth.Mappers;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Auth.Queries.GetCurrentUser;

public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, UserProfileDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetCurrentUserQueryHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<UserProfileDto> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        if (!_currentUser.IsAuthenticated)
            throw new UnauthorizedException("User is not authenticated");

        var employee = await _context.Employees
            .Include(e => e.Role)
                .ThenInclude(r => r!.RolePermissions)
                    .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(e => e.Id == _currentUser.UserId, cancellationToken);

        if (employee == null)
            throw new NotFoundException("Employee", _currentUser.UserId);

        var permissions = employee.Role?.RolePermissions
            .Select(rp => rp.Permission!.Name)
            .ToList() ?? new List<string>();

        return employee.ToUserProfile(permissions);
    }
}