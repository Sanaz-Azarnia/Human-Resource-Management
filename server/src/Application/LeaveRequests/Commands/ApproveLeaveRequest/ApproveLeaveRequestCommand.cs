using Application.LeaveRequests.DTOs;
using MediatR;

namespace Application.LeaveRequests.Commands.ApproveLeaveRequest;

public class ApproveLeaveRequestCommand : IRequest<LeaveRequestDto>
{
    public int Id { get; set; }
    public string? AdminNote { get; set; }
}