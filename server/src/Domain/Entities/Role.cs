using Domain.Common;

namespace Domain.Entities;

public class Role : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public bool IsActive { get; private set; }

    // Protected Collections
    private readonly List<RolePermission> _rolePermissions = new();
    private readonly List<Employee> _employees = new();

    public IReadOnlyCollection<RolePermission> RolePermissions => _rolePermissions.AsReadOnly();
    public IReadOnlyCollection<Employee> Employees => _employees.AsReadOnly();

    // Parameterless constructor for EF Core
    protected Role() { }

    // Factory Method
    public static Role Create(string name, string? description = null)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Role name cannot be empty.");

        return new Role
        {
            Name = name,
            Description = description,
            IsActive = true
        };
    }

    // Behaviors
    public void UpdateDetails(string name, string? description)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Role name cannot be empty.");

        Name = name;
        Description = description;
    }

    public void Activate() => IsActive = true;
    
    public void Deactivate() => IsActive = false;

    public void AssignPermission(int permissionId)
    {
        // اگر این دسترسی از قبل به نقش داده شده بود، از اضافه کردن مجدد جلوگیری کن
        if (_rolePermissions.Any(rp => rp.PermissionId == permissionId))
            return;

        _rolePermissions.Add(new RolePermission(Id, permissionId));
    }

    public void RemovePermission(int permissionId)
    {
        var rolePermission = _rolePermissions.FirstOrDefault(rp => rp.PermissionId == permissionId);
        if (rolePermission != null)
        {
            _rolePermissions.Remove(rolePermission);
        }
    }
}