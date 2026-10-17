using Application.Admin.DTOs;
using Application.Admin.Mappers;
using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Admin.Commands.CreateRole;

public class CreateRoleCommandHandler : IRequestHandler<CreateRoleCommand, RoleDto>
{
    private readonly IApplicationDbContext _context;

    public CreateRoleCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<RoleDto> Handle(CreateRoleCommand request, CancellationToken cancellationToken)
    {
         
        var role = Role.Create(request.Name, request.Description);

        if (!request.IsActive)
        {
            role.Deactivate();
        }

        _context.Roles.Add(role);
        await _context.SaveChangesAsync(cancellationToken);

        return role.ToDto();
    }
}