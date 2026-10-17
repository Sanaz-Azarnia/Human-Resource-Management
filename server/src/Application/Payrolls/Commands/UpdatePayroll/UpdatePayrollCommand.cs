using Application.Payrolls.DTOs;
using MediatR;

namespace Application.Payrolls.Commands.UpdatePayroll;

public class UpdatePayrollCommand : IRequest<PayrollDto>
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal BaseSalary { get; set; }
    public decimal Overtime { get; set; }
    public decimal Bonus { get; set; }
    public decimal Tax { get; set; }
    public decimal Insurance { get; set; }
    public bool IsPaid { get; set; }
}