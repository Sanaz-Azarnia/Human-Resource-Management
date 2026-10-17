using FluentValidation;

namespace Application.LeaveRequests.Commands.CreateLeaveRequest;

public class CreateLeaveRequestCommandValidator : AbstractValidator<CreateLeaveRequestCommand>
{
    public CreateLeaveRequestCommandValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters");

        RuleFor(x => x.Reason)
            .NotEmpty().WithMessage("Reason is required");

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("StartDate is required");

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("EndDate is required")
            .GreaterThanOrEqualTo(x => x.StartDate)
            .WithMessage("EndDate must be greater than or equal to StartDate");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Type is required")
            .MaximumLength(20).WithMessage("Type cannot exceed 20 characters");
    }
}