using Application.LeaveRequests.DTOs;
using MediatR;

namespace Application.LeaveRequests.Queries.GetLeaveRequestsByEmployeeId;

public class GetLeaveRequestsByEmployeeIdQuery : IRequest<List<LeaveRequestDto>>
{
    public int EmployeeId { get; set; }

    public GetLeaveRequestsByEmployeeIdQuery(int employeeId)
    {
        EmployeeId = employeeId;
    }
}