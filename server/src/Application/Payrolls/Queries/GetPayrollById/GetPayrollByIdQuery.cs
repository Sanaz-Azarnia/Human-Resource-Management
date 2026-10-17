using Application.Payrolls.DTOs;
using MediatR;

namespace Application.Payrolls.Queries.GetPayrollById;

public class GetPayrollByIdQuery : IRequest<PayrollDto>
{
    public int Id { get; set; }

    public GetPayrollByIdQuery(int id)
    {
        Id = id;
    }
}