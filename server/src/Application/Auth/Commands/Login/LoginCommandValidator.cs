using FluentValidation;

namespace Application.Auth.Commands.Login;

public class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(x => x.PersonnelId)
            .NotEmpty().WithMessage("PersonnelId is required");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required");
    }
}