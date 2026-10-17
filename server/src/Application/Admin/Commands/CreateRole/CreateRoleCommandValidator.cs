using FluentValidation;

namespace Application.Admin.Commands.CreateRole;

public class CreateRoleCommandValidator : AbstractValidator<CreateRoleCommand>
{
    public CreateRoleCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Role name is required")
            .MaximumLength(50).WithMessage("Role name cannot exceed 50 characters");
    }
}