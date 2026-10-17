using Application.Employees.DTOs;
using MediatR;

namespace Application.Employees.Queries.GetEmployeeByPersonnelId;

public class GetEmployeeByPersonnelIdQuery : IRequest<EmployeeDto>
{
    public string PersonnelId { get; set; }

    public GetEmployeeByPersonnelIdQuery(string personnelId)
    {
        PersonnelId = personnelId;
    }
}