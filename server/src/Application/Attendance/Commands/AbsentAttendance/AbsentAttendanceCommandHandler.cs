using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Attendance.Commands.AbsentAttendance;

public class AbsentAttendanceCommandHandler : IRequestHandler<AbsentAttendanceCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IPermissionService _permissionService;

    public AbsentAttendanceCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IPermissionService permissionService)
    {
        _context = context;
        _currentUser = currentUser;
        _permissionService = permissionService;
    }

    public async Task<bool> Handle(AbsentAttendanceCommand request, CancellationToken cancellationToken)
    {
        var attendance = await _context.Attendances
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (attendance == null)
            throw new NotFoundException("Attendance", request.Id);

        // بررسی دسترسی
        bool canVerify = await _permissionService.HasPermissionAsync(_currentUser.UserId, "attendance:absent");
        if (!canVerify)
            throw new ForbiddenException("You don't have permission to verify attendance");

        // استفاده از Rich Model
        attendance.MarkAsAbsent();

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}