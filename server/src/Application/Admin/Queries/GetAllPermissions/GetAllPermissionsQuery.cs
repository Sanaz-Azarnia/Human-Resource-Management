 using Application.Admin.DTOs;
using MediatR;

namespace Application.Admin.Queries.GetAllPermissions;

public class GetAllPermissionsQuery : IRequest<List<PermissionDto>>
{
}