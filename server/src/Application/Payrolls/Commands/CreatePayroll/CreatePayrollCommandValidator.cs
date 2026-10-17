using FluentValidation;

namespace Application.Payrolls.Commands.CreatePayroll;

public class CreatePayrollCommandValidator : AbstractValidator<CreatePayrollCommand>
{
    public CreatePayrollCommandValidator()
    {
        RuleFor(x => x.Year)
            .GreaterThan(2000).WithMessage("Year must be greater than 2000")
            .LessThan(2100).WithMessage("Year must be less than 2100");

        RuleFor(x => x.Month)
            .InclusiveBetween(1, 12).WithMessage("Month must be between 1 and 12");

        RuleFor(x => x.BaseSalary)
            .GreaterThanOrEqualTo(0).WithMessage("BaseSalary cannot be negative")
            .LessThanOrEqualTo(500000).WithMessage("BaseSalary cannot exceed 500000");

        RuleFor(x => x.Overtime)
            .GreaterThanOrEqualTo(0).WithMessage("Overtime cannot be negative")
            .LessThanOrEqualTo(500000).WithMessage("Overtime cannot exceed 500000");

        RuleFor(x => x.Bonus)
            .GreaterThanOrEqualTo(0).WithMessage("Bonus cannot be negative")
            .LessThanOrEqualTo(500000).WithMessage("Bonus cannot exceed 500000");

        RuleFor(x => x.Tax)
            .GreaterThanOrEqualTo(0).WithMessage("Tax cannot be negative")
            .LessThanOrEqualTo(500000).WithMessage("Tax cannot exceed 500000");

        RuleFor(x => x.Insurance)
            .GreaterThanOrEqualTo(0).WithMessage("Insurance cannot be negative")
            .LessThanOrEqualTo(500000).WithMessage("Insurance cannot exceed 500000");
    }
}