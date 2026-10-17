using MediatR;

namespace Application.Attendance.Commands.AbsentAttendance;

public class AbsentAttendanceCommand : IRequest<bool>
{
    public int Id { get; set; }

    public AbsentAttendanceCommand(int id)
    {
        Id = id;
    }
}