using FluentValidation;

namespace Application.Reports.Commands.UpdateReport;

public class UpdateReportCommandValidator : AbstractValidator<UpdateReportCommand>
{
    public UpdateReportCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Report Id is required");

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Content is required");

        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("Type is required")
            .MaximumLength(20).WithMessage("Type cannot exceed 20 characters");
    }
}