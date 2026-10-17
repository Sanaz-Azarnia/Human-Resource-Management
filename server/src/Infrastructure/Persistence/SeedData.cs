using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Persistence;

public static class SeedData
{
    public static async Task InitializeAsync(
        AppDbContext context, 
        IConfiguration configuration,
        IPasswordHasher passwordHasher)
    {
        await SeedRolesAsync(context);
        await SeedPermissionsAsync(context);
        await AssignPermissionsToAdminRoleAsync(context);
        await AssignPermissionsToOtherRolesAsync(context);
        await SeedDemoUsersAsync(context, passwordHasher);
    }

    private static async Task SeedRolesAsync(AppDbContext context)
    {
        if (await context.Roles.AnyAsync()) return;

        var roles = new List<Role>
        {
            Role.Create("Admin", "System Administrator"),
            Role.Create("Manager", "Department Manager"),
            Role.Create("Deputy", "Deputy Manager"),
            Role.Create("Employee", "Basic Employee"),
            Role.Create("Staff", "Regular Staff"),
        };

        context.Roles.AddRange(roles);
        await context.SaveChangesAsync();
    }

    private static async Task SeedPermissionsAsync(AppDbContext context)
    {
        var existingPermissions = await context.Permissions.Select(p => p.Name).ToListAsync();

        var allPermissions = new List<Permission>
        {
            Permission.Create("employee:view:all", "View all employees"),
            Permission.Create("employee:view:own", "View own employee profile"),
            Permission.Create("employee:create", "Create employee"),
            Permission.Create("employee:edit:all", "Edit all employees"),
            Permission.Create("employee:edit:own", "Edit own employee profile"),
            Permission.Create("employee:delete", "Delete employee"),
            
            Permission.Create("payroll:view:all", "View all payrolls"),
            Permission.Create("payroll:view:own", "View own payroll"),
            Permission.Create("payroll:create", "Create payroll"),
            Permission.Create("payroll:edit:all", "Edit all payrolls"),
            Permission.Create("payroll:edit:own", "Edit own payroll"),
            Permission.Create("payroll:delete", "Delete payroll"),

            Permission.Create("attendance:view:all", "View all attendances"),
            Permission.Create("attendance:view:own", "View own attendance"),
            Permission.Create("attendance:create", "Create attendance"),
            Permission.Create("attendance:edit:all", "Edit all attendances"),
            Permission.Create("attendance:edit:own", "Edit own attendance"),
            Permission.Create("attendance:delete", "Delete attendance"),
            Permission.Create("attendance:present", "Verify present"),
            Permission.Create("attendance:absent", "Verify absent"),

            Permission.Create("leaveRequest:view:all", "View all leave requests"),
            Permission.Create("leaveRequest:view:own", "View own leave requests"),
            Permission.Create("leaveRequest:create", "Create leave request"),
            Permission.Create("leaveRequest:edit:all", "Edit all leave requests"),
            Permission.Create("leaveRequest:edit:own", "Edit own leave requests"),
            Permission.Create("leaveRequest:delete", "Delete any leave request"),
            Permission.Create("leaveRequest:delete:own", "Delete own leave request"),
            Permission.Create("leaveRequest:approve", "Approve leave request"),
            Permission.Create("leaveRequest:reject", "Reject leave request"),

            Permission.Create("report:view:all", "View all reports"),
            Permission.Create("report:view:own", "View own reports"),
            Permission.Create("report:create", "Create report"),
            Permission.Create("report:edit:all", "Edit all reports"),
            Permission.Create("report:edit:own", "Edit own reports"),
            Permission.Create("report:delete", "Delete any report"),
            Permission.Create("report:delete:own", "Delete own report"),

            Permission.Create("role:manage", "Manage roles"),
            Permission.Create("permission:manage", "Manage permissions"),
        };

        var newPermissions = allPermissions.Where(p => !existingPermissions.Contains(p.Name)).ToList();

        if (newPermissions.Any())
        {
            context.Permissions.AddRange(newPermissions);
            await context.SaveChangesAsync();
        }
    }

    private static async Task AssignPermissionsToAdminRoleAsync(AppDbContext context)
    {
        var adminRole = await context.Roles
            .Include(r => r.RolePermissions)
            .FirstOrDefaultAsync(r => r.Name == "Admin");

        if (adminRole == null) return;

        var allPermissionIds = await context.Permissions.Select(p => p.Id).ToListAsync();
        var existingIds = adminRole.RolePermissions.Select(rp => rp.PermissionId).ToList();
        var newIds = allPermissionIds.Except(existingIds).ToList();

        if (newIds.Any())
        {
            foreach (var id in newIds) adminRole.AssignPermission(id);
            await context.SaveChangesAsync();
        }
    }

    private static async Task AssignPermissionsToOtherRolesAsync(AppDbContext context)
    {
        var roles = await context.Roles.Include(r => r.RolePermissions).ToListAsync();
        var permDict = (await context.Permissions.ToListAsync()).ToDictionary(p => p.Name, p => p.Id);

        var rolePermissions = new Dictionary<string, string[]>
        {
            ["Manager"] = new[] {
                "employee:view:all", "employee:edit:all", "employee:create",
                "payroll:view:all", "payroll:create", "payroll:edit:all",
                "attendance:view:all", "attendance:edit:all", "attendance:present", "attendance:absent",
                "leaveRequest:view:all", "leaveRequest:approve", "leaveRequest:reject",
                "report:view:all", "report:create", "report:edit:all"
            },
            ["Deputy"] = new[] {
                "employee:view:all", "employee:edit:all",
                "payroll:view:all",
                "attendance:view:all", "attendance:present", "attendance:absent",
                "leaveRequest:view:all", "leaveRequest:approve", "leaveRequest:reject",
                "report:view:all", "report:create"
            },
            ["Employee"] = new[] {
                "employee:view:own", "employee:edit:own",
                "payroll:view:own",
                "attendance:view:own", "attendance:edit:own",
                "leaveRequest:view:own", "leaveRequest:create", 
                "leaveRequest:edit:own", "leaveRequest:delete:own",
                "report:view:own", "report:create", "report:edit:own", "report:delete:own"
            },
            ["Staff"] = new[] {
                "employee:view:own", "payroll:view:own",
                "attendance:view:own", "leaveRequest:view:own", "report:view:own"
            }
        };

        foreach (var kvp in rolePermissions)
        {
            var role = roles.FirstOrDefault(r => r.Name == kvp.Key);
            if (role == null) continue;

            foreach (var permName in kvp.Value)
            {
                if (permDict.TryGetValue(permName, out var permId))
                    role.AssignPermission(permId);
            }
        }

        await context.SaveChangesAsync();
    }

    
    private static async Task SeedDemoUsersAsync(
        AppDbContext context, 
        IPasswordHasher passwordHasher)
    {
        var roles = await context.Roles.ToListAsync();
        var roleDict = roles.ToDictionary(r => r.Name, r => r.Id);

         
        var usersInfo = new[]
        {
            new { Role = "Admin",    First = "System", Last = "Admin",      PersonnelId = "86720194", NatId = "1478259866", Email = "admin@company.com",    Phone = "09120000001", Salary = 500000m, Addr = "HQ" },
            new { Role = "Manager",  First = "Maria",    Last = "Garcia",     PersonnelId = "12345678", NatId = "0012345678", Email = "manager@company.com",  Phone = "09120000002", Salary = 400000m, Addr = "US Company" },
            new { Role = "Deputy",   First = "John",   Last = "Smith",  PersonnelId = "23456789", NatId = "0023456789", Email = "deputy@company.com",   Phone = "09120000003", Salary = 350000m, Addr = "US Company" },
            new { Role = "Employee", First = "Robert",   Last = "Jones",     PersonnelId = "34567890", NatId = "0034567890", Email = "employee@company.com", Phone = "09120000004", Salary = 250000m, Addr = "US Company" },
        };

         
        foreach (var user in usersInfo)
        {
            var envKey = $"{user.Role.ToUpper()}_PASSWORD";
            var password = Environment.GetEnvironmentVariable(envKey);

            if (string.IsNullOrEmpty(password))
            {
                Console.WriteLine($"Skipping {user.Role}: {envKey} not set in environment");
                continue;
            }

            if (await context.Employees.AnyAsync(e => e.PersonnelId == user.PersonnelId))
            {
                Console.WriteLine($"{user.Role} already exists, skipping");
                continue;
            }

            if (!roleDict.TryGetValue(user.Role, out var roleId))
                continue;

            var employee = Employee.Create(
                firstname: user.First,
                lastname: user.Last,
                personnelId: user.PersonnelId,
                nationalId: user.NatId,
                email: user.Email,
                phone: user.Phone,
                passwordHash: passwordHasher.Hash(password),
                address: user.Addr,
                roleId: roleId,
                baseSalary: user.Salary,
                avatarUrl: null
            );

            context.Employees.Add(employee);
            Console.WriteLine($"Seeded {user.Role}: {user.First} {user.Last}");
        }

        await context.SaveChangesAsync();
    }
}