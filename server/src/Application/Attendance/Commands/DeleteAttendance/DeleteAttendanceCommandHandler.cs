using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Attendance.Commands.DeleteAttendance;

public class DeleteAttendanceCommandHandler : IRequestHandler<DeleteAttendanceCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IPermissionService _permissionService;

    public DeleteAttendanceCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IPermissionService permissionService)
    {
        _context = context;
        _currentUser = currentUser;
        _permissionService = permissionService;
    }

    public async Task<bool> Handle(DeleteAttendanceCommand request, CancellationToken cancellationToken)
    {
        var attendance = await _context.Attendances
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (attendance == null)
            throw new NotFoundException("Attendance", request.Id);

        // بررسی دسترسی حذف
        bool canDelete = await _permissionService.HasPermissionAsync(_currentUser.UserId, "attendance:delete");
        if (!canDelete)
            throw new ForbiddenException("You don't have permission to delete attendance");

        _context.Attendances.Remove(attendance);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}