namespace Application.Employees.DTOs;

public class EmployeeDto
{
    public int Id { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public string PersonnelId { get; set; } = string.Empty;
    public string NationalId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string RoleName { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public decimal BaseSalary { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
}