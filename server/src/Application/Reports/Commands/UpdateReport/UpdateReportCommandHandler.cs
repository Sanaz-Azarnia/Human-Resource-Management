 using Application.Reports.DTOs;
using Application.Reports.Mappers;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Reports.Commands.UpdateReport;

public class UpdateReportCommandHandler : IRequestHandler<UpdateReportCommand, ReportDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IPermissionService _permissionService;

    public UpdateReportCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IPermissionService permissionService)
    {
        _context = context;
        _currentUser = currentUser;
        _permissionService = permissionService;
    }

    public async Task<ReportDto> Handle(UpdateReportCommand request, CancellationToken cancellationToken)
    {
        var report = await _context.Reports
            .FirstOrDefaultAsync(r => r.Id == request.Id, cancellationToken);

        if (report == null)
            throw new NotFoundException("Report", request.Id);

         
        bool isOwner = report.EmployeeId == _currentUser.UserId;
        bool canEditAll = await _permissionService.HasPermissionAsync(_currentUser.UserId, "report:edit:all");
        bool canEditOwn = await _permissionService.HasPermissionAsync(_currentUser.UserId, "report:edit:own");

        if (!isOwner && !canEditAll)
            throw new ForbiddenException("You don't have permission to edit this report");

        if (isOwner && !canEditOwn && !canEditAll)
            throw new ForbiddenException("You don't have permission to edit your own report");

         
        report.UpdateDetails(
            request.Title,
            request.Content,
            request.Type,
            request.AttachmentUrl
        );

        await _context.SaveChangesAsync(cancellationToken);

         
        var result = await _context.Reports
            .Include(r => r.Employee)
            .FirstAsync(r => r.Id == report.Id, cancellationToken);

        return result.ToDto();
    }
}