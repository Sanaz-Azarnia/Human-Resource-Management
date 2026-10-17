using FluentValidation;

namespace Application.Attendance.Commands.UpdateAttendance;

public class UpdateAttendanceCommandValidator : AbstractValidator<UpdateAttendanceCommand>
{
    public UpdateAttendanceCommandValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0).WithMessage("Attendance Id is required");

        RuleFor(x => x.Date)
            .NotEmpty().WithMessage("Date is required");

        RuleFor(x => x.Notes)
            .MaximumLength(200).WithMessage("Notes cannot exceed 200 characters");
    }
}