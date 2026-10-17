using Application.LeaveRequests.DTOs;
using Application.LeaveRequests.Mappers;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.LeaveRequests.Queries.GetPendingLeaveRequests;

public class GetPendingLeaveRequestsQueryHandler : IRequestHandler<GetPendingLeaveRequestsQuery, List<LeaveRequestDto>>
{
    private readonly IApplicationDbContext _context;

    public GetPendingLeaveRequestsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<LeaveRequestDto>> Handle(GetPendingLeaveRequestsQuery request, CancellationToken cancellationToken)
    {
        var leaveRequests = await _context.LeaveRequests
            .Include(l => l.Employee)
            .Where(l => l.Status == "Pending")
            .ToListAsync(cancellationToken);

        return leaveRequests.Select(l => l.ToDto()).ToList();
    }
}