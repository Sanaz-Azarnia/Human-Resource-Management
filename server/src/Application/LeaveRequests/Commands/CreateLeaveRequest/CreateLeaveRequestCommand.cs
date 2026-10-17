using Application.LeaveRequests.DTOs;
using MediatR;

namespace Application.LeaveRequests.Commands.CreateLeaveRequest;

public class CreateLeaveRequestCommand : IRequest<LeaveRequestDto>
{
    public string Title { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Type { get; set; } = string.Empty;
}