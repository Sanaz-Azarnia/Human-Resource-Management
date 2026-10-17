using Application.LeaveRequests.DTOs;
using MediatR;

namespace Application.LeaveRequests.Commands.UpdateLeaveRequest;

public class UpdateLeaveRequestCommand : IRequest<LeaveRequestDto>
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Type { get; set; } = string.Empty;
}