using Application.LeaveRequests.DTOs;
using Application.LeaveRequests.Mappers;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.LeaveRequests.Commands.RejectLeaveRequest;

public class RejectLeaveRequestCommandHandler : IRequestHandler<RejectLeaveRequestCommand, LeaveRequestDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IPermissionService _permissionService;

    public RejectLeaveRequestCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IPermissionService permissionService)
    {
        _context = context;
        _currentUser = currentUser;
        _permissionService = permissionService;
    }

    public async Task<LeaveRequestDto> Handle(RejectLeaveRequestCommand request, CancellationToken cancellationToken)
    {
        var leaveRequest = await _context.LeaveRequests
            .FirstOrDefaultAsync(l => l.Id == request.Id, cancellationToken);

        if (leaveRequest == null)
            throw new NotFoundException("LeaveRequest", request.Id);

        // بررسی دسترسی
        bool canReject = await _permissionService.HasPermissionAsync(_currentUser.UserId, "leaveRequest:reject");
        if (!canReject)
            throw new ForbiddenException("You don't have permission to reject leave requests");

        // استفاده از Rich Model
        leaveRequest.Reject(request.AdminNote);

        await _context.SaveChangesAsync(cancellationToken);

        // بارگذاری مجدد
        var result = await _context.LeaveRequests
            .Include(l => l.Employee)
            .FirstAsync(l => l.Id == leaveRequest.Id, cancellationToken);

        return result.ToDto();
    }
}