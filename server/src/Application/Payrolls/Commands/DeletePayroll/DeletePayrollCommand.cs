using MediatR;

namespace Application.Payrolls.Commands.DeletePayroll;

public class DeletePayrollCommand : IRequest<bool>
{
    public int Id { get; set; }

    public DeletePayrollCommand(int id)
    {
        Id = id;
    }
}