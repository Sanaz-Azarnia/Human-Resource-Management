using Application.Employees.DTOs;
using MediatR;

namespace Application.Employees.Queries.GetAllEmployees;

public class GetAllEmployeesQuery : IRequest<List<EmployeeDto>>
{
}