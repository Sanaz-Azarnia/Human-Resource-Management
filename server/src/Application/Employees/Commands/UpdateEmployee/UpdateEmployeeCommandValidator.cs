using FluentValidation;

namespace Application.Employees.Commands.UpdateEmployee;

public class UpdateEmployeeCommandValidator : AbstractValidator<UpdateEmployeeCommand>
{
    public UpdateEmployeeCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Employee Id is required");

        RuleFor(x => x.Firstname)
            .NotEmpty().WithMessage("Firstname is required")
            .MaximumLength(50).WithMessage("Firstname cannot exceed 50 characters");

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
            .MinimumLength(6).WithMessage("Password must be at least 6 characters")
            .When(x => !string.IsNullOrEmpty(x.Password));

        RuleFor(x => x.RoleId)
            .GreaterThan(0).WithMessage("RoleId is required");

        RuleFor(x => x.BaseSalary)
            .GreaterThanOrEqualTo(0).WithMessage("BaseSalary cannot be negative");
    }
}