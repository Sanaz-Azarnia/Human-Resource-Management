using Application.LeaveRequests.DTOs;
using MediatR;

namespace Application.LeaveRequests.Commands.RejectLeaveRequest;

public class RejectLeaveRequestCommand : IRequest<LeaveRequestDto>
{
    public int Id { get; set; }
    public string? AdminNote { get; set; }
}