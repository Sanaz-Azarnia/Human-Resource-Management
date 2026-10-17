using Application.Attendance.DTOs;
using Application.Attendance.Mappers;
using Application.Common.Interfaces;
using Application.Common.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Attendance.Commands.CreateAttendance;

public class CreateAttendanceCommandHandler : IRequestHandler<CreateAttendanceCommand, AttendanceDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public CreateAttendanceCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<AttendanceDto> Handle(CreateAttendanceCommand request, CancellationToken cancellationToken)
    {
       
        var sheet = await _context.AttendanceSheets
            .FirstOrDefaultAsync(s => s.Id == request.SheetId, cancellationToken);

        if (sheet == null)
            throw new NotFoundException("AttendanceSheet", request.SheetId);

       
        var attendance = Domain.Entities.Attendance.Create(
            sheetId: request.SheetId,
            employeeId: _currentUser.UserId,
            date: sheet.Date
        );

        if (request.CheckIn.HasValue)
        {
            attendance.RecordCheckIn(request.CheckIn.Value);
        }

        if (request.CheckOut.HasValue)
        {
            attendance.RecordCheckOut(request.CheckOut.Value);
        }

        if (!string.IsNullOrEmpty(request.Notes))
        {
            attendance.UpdateNotes(request.Notes);
        }

        _context.Attendances.Add(attendance);
        await _context.SaveChangesAsync(cancellationToken);

        var result = await _context.Attendances
            .Include(a => a.Employee)
            .FirstAsync(a => a.Id == attendance.Id, cancellationToken);

        return result.ToDto();
    }
}