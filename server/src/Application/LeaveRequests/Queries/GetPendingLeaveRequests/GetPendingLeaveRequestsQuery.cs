using Application.LeaveRequests.DTOs;
using MediatR;

namespace Application.LeaveRequests.Queries.GetPendingLeaveRequests;

public class GetPendingLeaveRequestsQuery : IRequest<List<LeaveRequestDto>>
{
}