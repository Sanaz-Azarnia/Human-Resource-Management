using MediatR;

namespace Application.Reports.Commands.DeleteReport;

public class DeleteReportCommand : IRequest<bool>
{
    public int Id { get; set; }

    public DeleteReportCommand(int id)
    {
        Id = id;
    }
}