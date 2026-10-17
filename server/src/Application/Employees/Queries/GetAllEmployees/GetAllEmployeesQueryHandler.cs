 using Application.Employees.DTOs;
using Application.Employees.Mappers;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Employees.Queries.GetAllEmployees;

public class GetAllEmployeesQueryHandler : IRequestHandler<GetAllEmployeesQuery, List<EmployeeDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllEmployeesQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<EmployeeDto>> Handle(GetAllEmployeesQuery request, CancellationToken cancellationToken)
    {
        var employees = await _context.Employees
            .Include(e => e.Role)
            .ToListAsync(cancellationToken);

      
        return employees.Select(e => e.ToDto()).ToList();
    }
}