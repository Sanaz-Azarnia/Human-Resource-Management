using Application.LeaveRequests.DTOs;
using Application.LeaveRequests.Mappers;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.LeaveRequests.Queries.GetAllLeaveRequests;

public class GetAllLeaveRequestsQueryHandler : IRequestHandler<GetAllLeaveRequestsQuery, List<LeaveRequestDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllLeaveRequestsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<LeaveRequestDto>> Handle(GetAllLeaveRequestsQuery request, CancellationToken cancellationToken)
    {
        var leaveRequests = await _context.LeaveRequests
            .Include(l => l.Employee)
            .ToListAsync(cancellationToken);

        return leaveRequests.Select(l => l.ToDto()).ToList();
    }
}