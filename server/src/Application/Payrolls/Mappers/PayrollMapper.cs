using Application.Payrolls.DTOs;
using Domain.Entities;

namespace Application.Payrolls.Mappers;

public static class PayrollMapper
{
    public static PayrollDto ToDto(this Payroll payroll)
    {
        return new PayrollDto
        {
            Id = payroll.Id,
            UserId = payroll.EmployeeId,
            EmployeeName = payroll.Employee != null
                ? $"{payroll.Employee.Firstname} {payroll.Employee.Lastname}"
                : string.Empty,
            Year = payroll.Year.ToString(),
            Month = payroll.Month.ToString(),
            BaseSalary = payroll.BaseSalary,
            OverTime = payroll.Overtime,
            Bonus = payroll.Bonus,
            Tax = payroll.Tax,
            Insurance = payroll.Insurance,
            GrossSalary = payroll.GrossSalary,
            TotalDeduction = payroll.TotalDeductions,
            NetSalary = payroll.NetSalary,
            CreatedAt = payroll.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss"),
            IsPaid = payroll.IsPaid
        };
    }
}