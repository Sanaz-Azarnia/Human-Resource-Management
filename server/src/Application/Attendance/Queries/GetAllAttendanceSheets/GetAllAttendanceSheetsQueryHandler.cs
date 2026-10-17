using Application.Attendance.DTOs;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Attendance.Queries.GetAllAttendanceSheets;

public class GetAllAttendanceSheetsQueryHandler : IRequestHandler<GetAllAttendanceSheetsQuery, List<AttendanceSheetDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetAllAttendanceSheetsQueryHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<List<AttendanceSheetDto>> Handle(GetAllAttendanceSheetsQuery request, CancellationToken cancellationToken)
    {
        var currentUserId = _currentUser.UserId;

        var sheets = await _context.AttendanceSheets
            .OrderByDescending(s => s.Date)
            .ThenByDescending(s => s.Id)
            .ToListAsync(cancellationToken);

        var result = new List<AttendanceSheetDto>();

        foreach (var sheet in sheets)
        {
            // Check if the current user has already submitted attendance for this sheet
            var userAttendance = await _context.Attendances
                .FirstOrDefaultAsync(a => a.SheetId == sheet.Id && a.EmployeeId == currentUserId, cancellationToken);

            string userStatus = "NotRecorded";
            bool isSubmitted = false;

            if (userAttendance != null)
            {
                isSubmitted = true;
                userStatus = userAttendance.IsPresent ? "Present" : "Absent";
            }

            result.Add(new AttendanceSheetDto
            {
                Id = sheet.Id,
                Date = sheet.Date,
                Title = sheet.Title,
                Notes = sheet.Notes,
                IsSubmitted = isSubmitted,
                UserStatus = userStatus
            });
        }

        return result;
    }
}