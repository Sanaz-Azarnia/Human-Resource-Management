 using Application.Auth.DTOs;
using Application.Auth.Mappers;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Auth.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponseDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenGenerator _tokenGenerator;

    public LoginCommandHandler(
        IApplicationDbContext context,
        IPasswordHasher passwordHasher,
        ITokenGenerator tokenGenerator)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenGenerator = tokenGenerator;
    }

    public async Task<AuthResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var employee = await _context.Employees
            .Include(e => e.Role)
                .ThenInclude(r => r!.RolePermissions)
                    .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(e => e.PersonnelId == request.PersonnelId, cancellationToken);

        if (employee == null)
            throw new UnauthorizedException("Invalid credentials");

        if (!_passwordHasher.Verify(request.Password, employee.PasswordHash))
            throw new UnauthorizedException("Invalid credentials");

        if (employee.Role == null || !employee.Role.IsActive)
            throw new UnauthorizedException("User role is inactive");

        var permissions = employee.Role.RolePermissions
            .Select(rp => rp.Permission!.Name)
            .ToList();

        var token = _tokenGenerator.GenerateToken(employee, permissions);

         
        return employee.ToAuthResponse(permissions, token);
    }
}