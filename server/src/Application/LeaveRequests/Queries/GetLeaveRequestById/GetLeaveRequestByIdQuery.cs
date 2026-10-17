using Application.LeaveRequests.DTOs;
using MediatR;

namespace Application.LeaveRequests.Queries.GetLeaveRequestById;

public class GetLeaveRequestByIdQuery : IRequest<LeaveRequestDto>
{
    public int Id { get; set; }

    public GetLeaveRequestByIdQuery(int id)
    {
        Id = id;
    }
}