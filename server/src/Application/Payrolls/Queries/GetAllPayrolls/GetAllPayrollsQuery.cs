using Application.Payrolls.DTOs;
using MediatR;

namespace Application.Payrolls.Queries.GetAllPayrolls;

public class GetAllPayrollsQuery : IRequest<List<PayrollDto>>
{
}