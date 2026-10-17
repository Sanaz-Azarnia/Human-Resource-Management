using Application.Attendance.DTOs;
using Application.Attendance.Mappers;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Attendance.Queries.GetAllAttendance;

public class GetAllAttendanceQueryHandler : IRequestHandler<GetAllAttendanceQuery, List<AttendanceDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllAttendanceQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<AttendanceDto>> Handle(GetAllAttendanceQuery request, CancellationToken cancellationToken)
    {
        var attendances = await _context.Attendances
            .Include(a => a.Employee)
            .OrderByDescending(a => a.Date)  
            .ThenByDescending(a => a.Id)      
            .ToListAsync(cancellationToken);

        return attendances.Select(a => a.ToDto()).ToList();
    }
}