using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Common.Interfaces;

public interface IApplicationDbContext
{
    DbSet<Employee> Employees { get; set; }
    
    
    DbSet<Domain.Entities.Attendance> Attendances { get; set; }
    DbSet<AttendanceSheet> AttendanceSheets { get; set; }
    DbSet<LeaveRequest> LeaveRequests { get; set; }
    DbSet<Payroll> Payrolls { get; set; }
    DbSet<Report> Reports { get; set; }
    DbSet<Role> Roles { get; set; }
    DbSet<Permission> Permissions { get; set; }
    DbSet<RolePermission> RolePermissions { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}