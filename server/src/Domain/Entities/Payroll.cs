using Domain.Common;

namespace Domain.Entities;

public class Payroll : BaseEntity
{
    public int EmployeeId { get; private set; }
    public Employee? Employee { get; private set; }
    public int Year { get; private set; }
    public int Month { get; private set; }
    public decimal BaseSalary { get; private set; }
    public decimal Overtime { get; private set; }
    public decimal Bonus { get; private set; }
    public decimal Tax { get; private set; }
    public decimal Insurance { get; private set; }
    public decimal GrossSalary { get; private set; }
    public decimal TotalDeductions { get; private set; }
    public decimal NetSalary { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public bool IsPaid { get; private set; }

    protected Payroll() { }

    public static Payroll Create(int employeeId, int year, int month, decimal baseSalary, decimal overtime, decimal bonus, decimal tax, decimal insurance)
    {
        var payroll = new Payroll
        {
            EmployeeId = employeeId,
            Year = year,
            Month = month,
            BaseSalary = baseSalary,
            Overtime = overtime,
            Bonus = bonus,
            Tax = tax,
            Insurance = insurance,
            IsPaid = false,
            CreatedAt = DateTime.UtcNow
        };

        payroll.CalculateTotals();
        return payroll;
    }

    public void UpdateDetails(decimal baseSalary, decimal overtime, decimal bonus, decimal tax, decimal insurance)
    {
        if (IsPaid)
            throw new DomainException("Cannot update a payroll that has already been paid.");

        BaseSalary = baseSalary;
        Overtime = overtime;
        Bonus = bonus;
        Tax = tax;
        Insurance = insurance;

        CalculateTotals();
    }

    public void MarkAsPaid()
    {
        IsPaid = true;
    }

    private void CalculateTotals()
    {
        GrossSalary = BaseSalary + Overtime + Bonus;
        TotalDeductions = Tax + Insurance;
        NetSalary = GrossSalary - TotalDeductions;
    }
}