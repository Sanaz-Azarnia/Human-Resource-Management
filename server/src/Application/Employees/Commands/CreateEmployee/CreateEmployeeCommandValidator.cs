using FluentValidation;

namespace Application.Employees.Commands.CreateEmployee;

public class CreateEmployeeCommandValidator : AbstractValidator<CreateEmployeeCommand>
{
    public CreateEmployeeCommandValidator()
    {
        RuleFor(x => x.Firstname)
            .NotEmpty().WithMessage("Firstname is required")
            .MaximumLength(50).WithMessage("Firstname cannot exceed 50 characters");

        RuleFor(x => x.Lastname)
            .MaximumLength(50).WithMessage("Lastname cannot exceed 50 characters");

        RuleFor(x => x.NationalId)
            .NotEmpty().WithMessage("NationalId is required")
            .Length(10).WithMessage("NationalId must be 10 characters");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone is required")
            .Length(11).WithMessage("Phone must be 11 characters");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters");

        RuleFor(x => x.RoleId)
            .GreaterThan(0).WithMessage("RoleId is required");

        RuleFor(x => x.BaseSalary)
            .GreaterThanOrEqualTo(0).WithMessage("BaseSalary cannot be negative");
    }
}