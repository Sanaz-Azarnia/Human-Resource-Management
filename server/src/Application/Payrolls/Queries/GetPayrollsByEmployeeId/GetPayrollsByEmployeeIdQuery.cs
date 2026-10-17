using Application.Payrolls.DTOs;
using MediatR;

namespace Application.Payrolls.Queries.GetPayrollsByEmployeeId;

public class GetPayrollsByEmployeeIdQuery : IRequest<List<PayrollDto>>
{
    public int EmployeeId { get; set; }

    public GetPayrollsByEmployeeIdQuery(int employeeId)
    {
        EmployeeId = employeeId;
    }
}