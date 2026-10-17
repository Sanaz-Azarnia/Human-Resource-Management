using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Attendance.Commands.CreateAttendanceSheet;

public class CreateAttendanceSheetCommandHandler : IRequestHandler<CreateAttendanceSheetCommand, int>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IPermissionService _permissionService;

    public CreateAttendanceSheetCommandHandler(
        IApplicationDbContext context, 
        ICurrentUserService currentUser, 
        IPermissionService permissionService)
    {
        _context = context;
        _currentUser = currentUser;
        _permissionService = permissionService;
    }

    public async Task<int> Handle(CreateAttendanceSheetCommand request, CancellationToken cancellationToken)
    {
        bool canCreate = await _permissionService.HasPermissionAsync(_currentUser.UserId, "attendance:create");
        if (!canCreate) 
            throw new ForbiddenException("You don't have permission to create an attendance sheet.");

        
        var sheet = AttendanceSheet.Create(
            request.Date, 
            request.Title, 
            request.Notes, 
            _currentUser.UserId
        );

        _context.AttendanceSheets.Add(sheet);
        await _context.SaveChangesAsync(cancellationToken);

        return sheet.Id;
    }
}