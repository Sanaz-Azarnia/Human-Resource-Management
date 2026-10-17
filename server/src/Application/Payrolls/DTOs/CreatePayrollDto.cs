namespace Application.Payrolls.DTOs;

public class CreatePayrollDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal BaseSalary { get; set; }
    public decimal OverTime { get; set; }
    public decimal Bonus { get; set; }
    public decimal Tax { get; set; }
    public decimal Insurance { get; set; }
    public bool IsPaid { get; set; }
}