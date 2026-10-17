using Application.LeaveRequests.DTOs;
using Application.LeaveRequests.Mappers;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.LeaveRequests.Commands.UpdateLeaveRequest;

public class UpdateLeaveRequestCommandHandler : IRequestHandler<UpdateLeaveRequestCommand, LeaveRequestDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IPermissionService _permissionService;

    public UpdateLeaveRequestCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IPermissionService permissionService)
    {
        _context = context;
        _currentUser = currentUser;
        _permissionService = permissionService;
    }

    public async Task<LeaveRequestDto> Handle(UpdateLeaveRequestCommand request, CancellationToken cancellationToken)
    {
        var leaveRequest = await _context.LeaveRequests
            .FirstOrDefaultAsync(l => l.Id == request.Id, cancellationToken);

        if (leaveRequest == null)
            throw new NotFoundException("LeaveRequest", request.Id);

        // بررسی دسترسی
        bool isOwner = leaveRequest.EmployeeId == _currentUser.UserId;
        bool canEditAll = await _permissionService.HasPermissionAsync(_currentUser.UserId, "leaveRequest:edit:all");
        bool canEditOwn = await _permissionService.HasPermissionAsync(_currentUser.UserId, "leaveRequest:edit:own");

        if (!isOwner && !canEditAll)
            throw new ForbiddenException("You don't have permission to edit this leave request");

        if (isOwner && !canEditOwn && !canEditAll)
            throw new ForbiddenException("You don't have permission to edit your own leave request");

        // آپدیت با Rich Model
        leaveRequest.UpdateDetails(
            request.Title,
            request.Reason,
            request.StartDate,
            request.EndDate,
            request.Type
        );

        await _context.SaveChangesAsync(cancellationToken);

        // بارگذاری مجدد
        var result = await _context.LeaveRequests
            .Include(l => l.Employee)
            .FirstAsync(l => l.Id == leaveRequest.Id, cancellationToken);

        return result.ToDto();
    }
}