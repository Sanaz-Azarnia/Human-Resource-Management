using MediatR;

namespace Application.Attendance.Commands.PresentAttendance;

public class PresentAttendanceCommand : IRequest<bool>
{
    public int Id { get; set; }

    public PresentAttendanceCommand(int id)
    {
        Id = id;
    }
}