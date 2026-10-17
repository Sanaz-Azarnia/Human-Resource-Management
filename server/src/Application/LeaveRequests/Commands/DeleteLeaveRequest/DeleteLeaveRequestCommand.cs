using MediatR;

namespace Application.LeaveRequests.Commands.DeleteLeaveRequest;

public class DeleteLeaveRequestCommand : IRequest<bool>
{
    public int Id { get; set; }

    public DeleteLeaveRequestCommand(int id)
    {
        Id = id;
    }
}