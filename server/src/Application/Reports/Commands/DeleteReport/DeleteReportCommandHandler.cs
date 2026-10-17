 using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Reports.Commands.DeleteReport;

public class DeleteReportCommandHandler : IRequestHandler<DeleteReportCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IPermissionService _permissionService;

    public DeleteReportCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IPermissionService permissionService)
    {
        _context = context;
        _currentUser = currentUser;
        _permissionService = permissionService;
    }

    public async Task<bool> Handle(DeleteReportCommand request, CancellationToken cancellationToken)
    {
        var report = await _context.Reports
            .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

        if (report == null)
            throw new NotFoundException("Report", request.Id);

         
        bool isOwner = report.EmployeeId == _currentUser.UserId;
        bool canDeleteAll = await _permissionService.HasPermissionAsync(_currentUser.UserId, "report:delete");
        bool canDeleteOwn = await _permissionService.HasPermissionAsync(_currentUser.UserId, "report:delete:own");

        if (!isOwner && !canDeleteAll)
            throw new ForbiddenException("You don't have permission to delete this report");

        if (isOwner && !canDeleteOwn && !canDeleteAll)
            throw new ForbiddenException("You don't have permission to delete your own report");

        _context.Reports.Remove(report);
        await _context.SaveChangesAsync(cancellationToken);

        return true;
    }
}