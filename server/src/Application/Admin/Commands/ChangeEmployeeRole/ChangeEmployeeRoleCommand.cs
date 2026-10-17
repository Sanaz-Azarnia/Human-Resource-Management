using MediatR;

namespace Application.Admin.Commands.ChangeEmployeeRole;

public class ChangeEmployeeRoleCommand : IRequest<bool>
{
    public int EmployeeId { get; set; }
    public int RoleId { get; set; }
}