using Application.LeaveRequests.DTOs;
using Application.LeaveRequests.Mappers;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.LeaveRequests.Queries.GetLeaveRequestsByEmployeeId;

public class GetLeaveRequestsByEmployeeIdQueryHandler : IRequestHandler<GetLeaveRequestsByEmployeeIdQuery, List<LeaveRequestDto>>
{
    private readonly IApplicationDbContext _context;

    public GetLeaveRequestsByEmployeeIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<LeaveRequestDto>> Handle(GetLeaveRequestsByEmployeeIdQuery request, CancellationToken cancellationToken)
    {
        var leaveRequests = await _context.LeaveRequests
            .Include(l => l.Employee)
            .Where(l => l.EmployeeId == request.EmployeeId)
            .ToListAsync(cancellationToken);

        return leaveRequests.Select(l => l.ToDto()).ToList();
    }
}