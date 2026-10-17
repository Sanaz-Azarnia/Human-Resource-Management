using Domain.Common;

namespace Domain.Entities;

public class Permission : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;

    // Protected Collection
    private readonly List<RolePermission> _rolePermissions = new();
    public IReadOnlyCollection<RolePermission> RolePermissions => _rolePermissions.AsReadOnly();

    // Parameterless constructor for EF Core
    protected Permission() { }

    // Factory Method
    public static Permission Create(string name, string description = "")
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Permission name cannot be empty.");

        return new Permission
        {
            Name = name,
            Description = description
        };
    }

    // Behaviors
    public void UpdateDetails(string name, string description)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new DomainException("Permission name cannot be empty.");

        Name = name;
        Description = description;
    }
}