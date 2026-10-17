using Application.Admin.DTOs;
using MediatR;

namespace Application.Admin.Queries.GetAllRoles;

public class GetAllRolesQuery : IRequest<List<RoleDto>>
{
}