using Application.Employees.DTOs;
using MediatR;

namespace Application.Employees.Queries.GetEmployeeById;

public class GetEmployeeByIdQuery : IRequest<EmployeeDto>
{
    public int Id { get; set; }

    public GetEmployeeByIdQuery(int id)
    {
        Id = id;
    }
}