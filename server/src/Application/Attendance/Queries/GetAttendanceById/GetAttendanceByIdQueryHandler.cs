using Application.Attendance.DTOs;
using Application.Attendance.Mappers;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Attendance.Queries.GetAttendanceById;

public class GetAttendanceByIdQueryHandler : IRequestHandler<GetAttendanceByIdQuery, AttendanceDto>
{
    private readonly IApplicationDbContext _context;

    public GetAttendanceByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AttendanceDto> Handle(GetAttendanceByIdQuery request, CancellationToken cancellationToken)
    {
        var attendance = await _context.Attendances
            .Include(a => a.Employee)
            .FirstOrDefaultAsync(a => a.Id == request.Id, cancellationToken);

        if (attendance == null)
            throw new NotFoundException("Attendance", request.Id);

        return attendance.ToDto();
    }
}