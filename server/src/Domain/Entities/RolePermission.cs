namespace Domain.Entities;

public class RolePermission
{
    public int RoleId { get; private set; }
    public Role? Role { get; private set; }

    public int PermissionId { get; private set; }
    public Permission? Permission { get; private set; }

    // Parameterless constructor for EF Core
    protected RolePermission() { }

    // Constructor for creating the relationship
    public RolePermission(int roleId, int permissionId)
    {
        RoleId = roleId;
        PermissionId = permissionId;
    }
}