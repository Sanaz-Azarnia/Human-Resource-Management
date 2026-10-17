namespace Application.Payrolls.DTOs;

public class PayrollDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string Year { get; set; } = string.Empty;
    public string Month { get; set; } = string.Empty;
    public decimal BaseSalary { get; set; }
    public decimal OverTime { get; set; }
    public decimal Bonus { get; set; }
    public decimal Tax { get; set; }
    public decimal Insurance { get; set; }
    public decimal GrossSalary { get; set; }
    public decimal TotalDeduction { get; set; }
    public decimal NetSalary { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
    public bool IsPaid { get; set; }
}