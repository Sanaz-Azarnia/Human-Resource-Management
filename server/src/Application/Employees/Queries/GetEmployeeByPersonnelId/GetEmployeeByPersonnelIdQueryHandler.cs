 using Application.Employees.DTOs;
using Application.Employees.Mappers;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Employees.Queries.GetEmployeeByPersonnelId;

public class GetEmployeeByPersonnelIdQueryHandler : IRequestHandler<GetEmployeeByPersonnelIdQuery, EmployeeDto>
{
    private readonly IApplicationDbContext _context;

    public GetEmployeeByPersonnelIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<EmployeeDto> Handle(GetEmployeeByPersonnelIdQuery request, CancellationToken cancellationToken)
    {
        var employee = await _context.Employees
            .Include(e => e.Role)
            .FirstOrDefaultAsync(e => e.PersonnelId == request.PersonnelId, cancellationToken);

        if (employee == null)
            throw new NotFoundException("Employee", request.PersonnelId);

         
        return employee.ToDto();
    }
}