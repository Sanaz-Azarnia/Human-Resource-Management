using Domain.Common;

namespace Domain.Entities;

public class Employee : BaseEntity
{
    public string Firstname { get; private set; } = string.Empty;
    public string Lastname { get; private set; } = string.Empty;
    public string PersonnelId { get; private set; } = string.Empty;
    public string NationalId { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Phone { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public string Address { get; private set; } = string.Empty;
    public int RoleId { get; private set; }
    public Role? Role { get; private set; }
    public string? AvatarUrl { get; private set; }
    public decimal BaseSalary { get; private set; }
    public DateTime CreatedAt { get; private set; }

    // Protected Collections
    private readonly List<Payroll> _payrolls = new();
    private readonly List<LeaveRequest> _leaveRequests = new();
    private readonly List<Report> _reports = new();
    private readonly List<Attendance> _attendances = new();

    public IReadOnlyCollection<Payroll> Payrolls => _payrolls.AsReadOnly();
    public IReadOnlyCollection<LeaveRequest> LeaveRequests => _leaveRequests.AsReadOnly();
    public IReadOnlyCollection<Report> Reports => _reports.AsReadOnly();
    public IReadOnlyCollection<Attendance> Attendances => _attendances.AsReadOnly();

    // Parameterless constructor for EF Core
    protected Employee() { }

    // Factory Method
    public static Employee Create(
        string firstname, string lastname, string personnelId, 
        string nationalId, string email, string phone, 
        string passwordHash, string address, int roleId, 
        decimal baseSalary, string? avatarUrl = null)
    {
        if (baseSalary < 0) 
            throw new DomainException("Base salary cannot be negative.");

        return new Employee
        {
            Firstname = firstname,
            Lastname = lastname,
            PersonnelId = personnelId,
            NationalId = nationalId,
            Email = email,
            Phone = phone,
            PasswordHash = passwordHash,
            Address = address,
            RoleId = roleId,
            BaseSalary = baseSalary,
            AvatarUrl = avatarUrl,
            CreatedAt = DateTime.UtcNow
        };
    }

    // Behaviors
    public void UpdatePersonalInfo(string firstname, string lastname, string email, string phone, string address, string? avatarUrl)
    {
        Firstname = firstname;
        Lastname = lastname;
        Email = email;
        Phone = phone;
        Address = address;
        AvatarUrl = avatarUrl;
    }

    public void ChangeRole(int newRoleId)
    {
        if (RoleId == newRoleId) return;
        RoleId = newRoleId;
    }

    public void AdjustBaseSalary(decimal newSalary)
    {
        if (newSalary < 0) 
            throw new DomainException("Salary cannot be negative.");
            
        BaseSalary = newSalary;
    }

    public void UpdatePasswordHash(string newPasswordHash)
    {
        PasswordHash = newPasswordHash;
    }
}