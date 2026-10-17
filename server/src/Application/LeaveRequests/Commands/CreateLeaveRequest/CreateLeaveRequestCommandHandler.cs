using Application.LeaveRequests.DTOs;
using Application.LeaveRequests.Mappers;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.LeaveRequests.Commands.CreateLeaveRequest;

public class CreateLeaveRequestCommandHandler : IRequestHandler<CreateLeaveRequestCommand, LeaveRequestDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public CreateLeaveRequestCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<LeaveRequestDto> Handle(CreateLeaveRequestCommand request, CancellationToken cancellationToken)
    {
        // ساخت مرخصی با Rich Model
        var leaveRequest = Domain.Entities.LeaveRequest.Create(
            employeeId: _currentUser.UserId,
            title: request.Title,
            reason: request.Reason,
            startDate: request.StartDate,
            endDate: request.EndDate,
            type: request.Type
        );

        _context.LeaveRequests.Add(leaveRequest);
        await _context.SaveChangesAsync(cancellationToken);

        // بارگذاری مجدد با Employee
        var result = await _context.LeaveRequests
            .Include(l => l.Employee)
            .FirstAsync(l => l.Id == leaveRequest.Id, cancellationToken);

        return result.ToDto();
    }
}