 using Application.Employees.DTOs;
using Application.Employees.Mappers;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Employees.Queries.GetEmployeeById;

public class GetEmployeeByIdQueryHandler : IRequestHandler<GetEmployeeByIdQuery, EmployeeDto>
{
    private readonly IApplicationDbContext _context;

    public GetEmployeeByIdQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<EmployeeDto> Handle(GetEmployeeByIdQuery request, CancellationToken cancellationToken)
    {
        var employee = await _context.Employees
            .Include(e => e.Role)
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

        if (employee == null)
            throw new NotFoundException("Employee", request.Id);

         
        return employee.ToDto();
    }
}