using FluentValidation;

namespace Application.Attendance.Commands.CreateAttendance;

public class CreateAttendanceCommandValidator : AbstractValidator<CreateAttendanceCommand>
{
    public CreateAttendanceCommandValidator()
    {
        RuleFor(x => x.SheetId)
            .GreaterThan(0).WithMessage("SheetId is required");

        RuleFor(x => x.Notes)
            .MaximumLength(200).WithMessage("Notes cannot exceed 200 characters");
    }
}