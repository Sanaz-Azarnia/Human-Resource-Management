using MediatR;

namespace Application.Admin.Queries.GetUserPermissions;

public class GetUserPermissionsQuery : IRequest<List<string>>
{
    public int EmployeeId { get; set; }

    public GetUserPermissionsQuery(int employeeId)
    {
        EmployeeId = employeeId;
    }
}