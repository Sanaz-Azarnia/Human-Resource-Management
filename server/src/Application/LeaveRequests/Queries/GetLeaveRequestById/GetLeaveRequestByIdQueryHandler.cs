using Application.LeaveRequests.DTOs;
using Application.LeaveRequests.Mappers;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.LeaveRequests.Queries.GetLeaveRequestById;

public class GetLeaveRequestByIdQueryHandler : IRequestHandler<GetLeaveRequestByIdQuery, LeaveRequestDto>
{
    private readonly IApplicationDbContext _context;

    public GetLeaveRequestByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<LeaveRequestDto> Handle(GetLeaveRequestByIdQuery request, CancellationToken cancellationToken)
    {
        var leaveRequest = await _context.LeaveRequests
            .Include(l => l.Employee)
            .FirstOrDefaultAsync(l => l.Id == request.Id, cancellationToken);

        if (leaveRequest == null)
            throw new NotFoundException("LeaveRequest", request.Id);

        return leaveRequest.ToDto();
    }
}