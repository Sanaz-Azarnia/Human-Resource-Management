using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.LeaveRequests.Commands.DeleteLeaveRequest;

public class DeleteLeaveRequestCommandHandler : IRequestHandler<DeleteLeaveRequestCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IPermissionService _permissionService;

    public DeleteLeaveRequestCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IPermissionService permissionService)
    {
        _context = context;
        _currentUser = currentUser;
        _permissionService = permissionService;
    }

    public async Task<bool> Handle(DeleteLeaveRequestCommand request, CancellationToken cancellationToken)
    {
        var leaveRequest = await _context.LeaveRequests
            .FirstOrDefaultAsync(l => l.Id == request.Id, cancellationToken);

        if (leaveRequest == null)
            throw new NotFoundException("LeaveRequest", request.Id);

        // بررسی دسترسی
        bool isOwner = leaveRequest.EmployeeId == _currentUser.UserId;
        bool canDeleteAll = await _permissionService.HasPermissionAsync(_currentUser.UserId, "leaveRequest:delete");
        bool canDeleteOwn = await _permissionService.HasPermissionAsync(_currentUser.UserId, "leaveRequest:delete:own");

        if (!isOwner && !canDeleteAll)
            throw new ForbiddenException("You don't have permission to delete this leave request");

        if (isOwner && !canDeleteOwn && !canDeleteAll)
            throw new ForbiddenException("You don't have permission to delete your own leave request");

        _context.LeaveRequests.Remove(leaveRequest);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}