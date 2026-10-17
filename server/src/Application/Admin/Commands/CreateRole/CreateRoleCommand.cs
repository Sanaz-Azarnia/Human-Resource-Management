using Application.Admin.DTOs;
using MediatR;

namespace Application.Admin.Commands.CreateRole;

public class CreateRoleCommand : IRequest<RoleDto>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}