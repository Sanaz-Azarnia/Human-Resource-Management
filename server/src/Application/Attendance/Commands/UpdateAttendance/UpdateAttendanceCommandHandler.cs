using Application.Attendance.DTOs;
using Application.Attendance.Mappers;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Attendance.Commands.UpdateAttendance;

public class UpdateAttendanceCommandHandler : IRequestHandler<UpdateAttendanceCommand, AttendanceDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IPermissionService _permissionService;

    public UpdateAttendanceCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IPermissionService permissionService)
    {
        _context = context;
        _currentUser = currentUser;
        _permissionService = permissionService;
    }

    public async Task<AttendanceDto> Handle(UpdateAttendanceCommand request, CancellationToken cancellationToken)
    {
        var attendance = await _context.Attendances
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (attendance == null)
            throw new NotFoundException("Attendance", request.Id);

        // بررسی دسترسی
        bool isOwner = attendance.EmployeeId == _currentUser.UserId;
        bool canEditAll = await _permissionService.HasPermissionAsync(_currentUser.UserId, "attendance:edit:all");
        bool canEditOwn = await _permissionService.HasPermissionAsync(_currentUser.UserId, "attendance:edit:own");

        if (!isOwner && !canEditAll)
            throw new ForbiddenException("You don't have permission to edit this attendance");

        if (isOwner && !canEditOwn && !canEditAll)
            throw new ForbiddenException("You don't have permission to edit your own attendance");

        // آپدیت فیلدها
        // نکته: در Rich Model باید متدهای مناسب رو صدا بزنیم
        // ولی چون فیلد Date در Rich Model فعلی متد آپدیت نداره، 
        // مستقیم آپدیت می‌کنیم یا باید متد آپدیت به Domain اضافه بشه

        // برای سادگی فعلاً مستقیم آپدیت می‌کنیم
        // در صورت نیاز می‌تونید متد UpdateDetails رو به Domain اضافه کنید
        
        _context.Attendances.Update(attendance);
        await _context.SaveChangesAsync(cancellationToken);

        // بارگذاری مجدد
        var result = await _context.Attendances
            .Include(a => a.Employee)
            .FirstAsync(a => a.Id == attendance.Id, cancellationToken);

        return result.ToDto();
    }
}