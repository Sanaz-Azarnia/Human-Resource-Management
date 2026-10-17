using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Attendance.Commands.SubmitAttendance;

public class SubmitAttendanceCommandHandler : IRequestHandler<SubmitAttendanceCommand, bool>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public SubmitAttendanceCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<bool> Handle(SubmitAttendanceCommand request, CancellationToken cancellationToken)
    {
        var sheet = await _context.AttendanceSheets
            .FirstOrDefaultAsync(s => s.Id == request.SheetId, cancellationToken);

        if (sheet == null)
            throw new NotFoundException("AttendanceSheet", request.SheetId);

         
        var today = DateTime.UtcNow.Date;
        if (sheet.Date.Date < today)
            throw new DomainException("This attendance sheet has expired and is closed.");

        if (!sheet.IsActive)
            throw new DomainException("This attendance sheet is closed.");

         
        var employeeId = _currentUser.UserId;

        var existingRecord = await _context.Attendances
            .FirstOrDefaultAsync(a => a.SheetId == request.SheetId && a.EmployeeId == employeeId, cancellationToken);

        if (existingRecord != null)
        {
            if (request.IsPresent)
            {
                existingRecord.MarkAsPresent();
                if (request.CheckIn.HasValue) existingRecord.RecordCheckIn(request.CheckIn.Value);
                if (request.CheckOut.HasValue) existingRecord.RecordCheckOut(request.CheckOut.Value);
            }
            else
            {
                existingRecord.MarkAsAbsent(request.Notes);
            }
        }
        else
        {
             
            var attendance = Domain.Entities.Attendance.Create(request.SheetId, employeeId, sheet.Date);
            
            if (request.IsPresent)
            {
                attendance.MarkAsPresent();
                if (request.CheckIn.HasValue) attendance.RecordCheckIn(request.CheckIn.Value);
                if (request.CheckOut.HasValue) attendance.RecordCheckOut(request.CheckOut.Value);
            }
            else
            {
                attendance.MarkAsAbsent(request.Notes);
            }
            _context.Attendances.Add(attendance);
        }

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }
}