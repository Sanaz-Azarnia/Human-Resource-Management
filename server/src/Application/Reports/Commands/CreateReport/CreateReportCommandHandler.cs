using Application.Reports.DTOs;
using Application.Reports.Mappers;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Reports.Commands.CreateReport;

public class CreateReportCommandHandler : IRequestHandler<CreateReportCommand, ReportDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public CreateReportCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<ReportDto> Handle(CreateReportCommand request, CancellationToken cancellationToken)
    {
         
        var report = Domain.Entities.Report.Create(
            employeeId: _currentUser.UserId,
            title: request.Title,
            content: request.Content,
            type: request.Type,
            attachmentUrl: request.AttachmentUrl
        );

        _context.Reports.Add(report);
        await _context.SaveChangesAsync(cancellationToken);

         
        var result = await _context.Reports
            .Include(r => r.Employee)
            .FirstAsync(r => r.Id == report.Id, cancellationToken);

        return result.ToDto();
    }
}