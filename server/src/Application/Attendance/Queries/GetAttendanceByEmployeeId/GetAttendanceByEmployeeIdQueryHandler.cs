using Application.Attendance.DTOs;
using Application.Attendance.Mappers;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Attendance.Queries.GetAttendanceByEmployeeId;

public class GetAttendanceByEmployeeIdQueryHandler : IRequestHandler<GetAttendanceByEmployeeIdQuery, List<AttendanceDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAttendanceByEmployeeIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AttendanceDto>> Handle(GetAttendanceByEmployeeIdQuery request, CancellationToken cancellationToken)
    {
        var attendances = await _context.Attendances
            .Include(a => a.Employee)
            .Where(a => a.EmployeeId == request.EmployeeId)
            .ToListAsync(cancellationToken);

        return attendances.Select(a => a.ToDto()).ToList();
    }
}