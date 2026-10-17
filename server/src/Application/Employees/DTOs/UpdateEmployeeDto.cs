namespace Application.Employees.DTOs;

public class UpdateEmployeeDto
{
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string PersonnelId { get; set; } = string.Empty;
    public string NationalId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string? Password { get; set; }
    public string Address { get; set; } = string.Empty;
    public int RoleId { get; set; }
    public string? AvatarUrl { get; set; }
    public decimal BaseSalary { get; set; }
}