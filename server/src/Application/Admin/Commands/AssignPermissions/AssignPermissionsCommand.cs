using MediatR;

namespace Application.Admin.Commands.AssignPermissions;

public class AssignPermissionsCommand : IRequest<bool>
{
    public int RoleId { get; set; }
    public List<int> PermissionIds { get; set; } = new();
}