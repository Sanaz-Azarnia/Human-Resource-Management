using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Attendance.Commands.PresentAttendance;

public class PresentAttendanceCommandHandler : IRequestHandler<PresentAttendanceCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IPermissionService _permissionService;

    public PresentAttendanceCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IPermissionService permissionService)
    {
        _context = context;
        _currentUser = currentUser;
        _permissionService = permissionService;
    }

    public async Task<bool> Handle(PresentAttendanceCommand request, CancellationToken cancellationToken)
    {
        var attendance = await _context.Attendances
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (attendance == null)
            throw new NotFoundException("Attendance", request.Id);

        // بررسی دسترسی
        bool canVerify = await _permissionService.HasPermissionAsync(_currentUser.UserId, "attendance:present");
        if (!canVerify)
            throw new ForbiddenException("You don't have permission to verify attendance");

        // استفاده از Rich Model
        attendance.MarkAsPresent();

        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}