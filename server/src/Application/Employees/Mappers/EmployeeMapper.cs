using Application.Employees.DTOs;
using Domain.Entities;

namespace Application.Employees.Mappers;

public static class EmployeeMapper
{
    public static EmployeeDto ToDto(this Employee employee)
    {
        return new EmployeeDto
        {
            Id = employee.Id,
            Firstname = employee.Firstname,
            Lastname = employee.Lastname,
            PersonnelId = employee.PersonnelId,
            NationalId = employee.NationalId,
            Email = employee.Email,
            Phone = employee.Phone,
            Address = employee.Address,
            RoleName = employee.Role != null ? employee.Role.Name : "Unknown",
            AvatarUrl = employee.AvatarUrl ?? string.Empty,
            BaseSalary = employee.BaseSalary,
            CreatedAt = employee.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss")
        };
    }
}