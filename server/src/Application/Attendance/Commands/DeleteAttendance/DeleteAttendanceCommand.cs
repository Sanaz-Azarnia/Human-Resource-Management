using MediatR;

namespace Application.Attendance.Commands.DeleteAttendance;

public class DeleteAttendanceCommand : IRequest<bool>
{
    public int Id { get; set; }

    public DeleteAttendanceCommand(int id)
    {
        Id = id;
    }
}