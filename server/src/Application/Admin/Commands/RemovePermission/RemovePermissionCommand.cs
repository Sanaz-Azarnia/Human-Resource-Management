using MediatR;

namespace Application.Admin.Commands.RemovePermission;

public class RemovePermissionCommand : IRequest<bool>
{
    public int RoleId { get; set; }
    public int PermissionId { get; set; }

    public RemovePermissionCommand(int roleId, int permissionId)
    {
        RoleId = roleId;
        PermissionId = permissionId;
    }
}