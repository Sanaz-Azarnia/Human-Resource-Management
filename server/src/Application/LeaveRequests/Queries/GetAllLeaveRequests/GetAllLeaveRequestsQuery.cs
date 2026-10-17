using Application.LeaveRequests.DTOs;
using MediatR;

namespace Application.LeaveRequests.Queries.GetAllLeaveRequests;

public class GetAllLeaveRequestsQuery : IRequest<List<LeaveRequestDto>>
{
}