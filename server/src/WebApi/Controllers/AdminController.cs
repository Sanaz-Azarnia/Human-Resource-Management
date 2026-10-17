 using Application.Admin.Commands.AssignPermissions;
using Application.Admin.Commands.CreateRole;
using Application.Admin.Commands.RemovePermission;
using Application.Admin.Commands.ChangeEmployeeRole;
using Application.Admin.Queries.GetAllRoles;
using Application.Admin.Queries.GetAllPermissions;
using Application.Admin.Queries.GetUserPermissions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly IMediator _mediator;

    public AdminController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("roles")]
    public async Task<IActionResult> GetAllRoles()
    {
        var result = await _mediator.Send(new GetAllRolesQuery());
        return Ok(result);
    }

    [HttpPost("roles")]
    public async Task<IActionResult> CreateRole(CreateRoleCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("roles/{roleId:int}/permissions")]
    public async Task<IActionResult> AssignPermissions(int roleId, AssignPermissionsCommand command)
    {
        command.RoleId = roleId;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("roles/{roleId:int}/permissions/{permissionId:int}")]
    public async Task<IActionResult> RemovePermission(int roleId, int permissionId)
    {
        var result = await _mediator.Send(new RemovePermissionCommand(roleId, permissionId));
        return Ok(result);
    }

    [HttpGet("permissions")]
    public async Task<IActionResult> GetAllPermissions()
    {
        var result = await _mediator.Send(new GetAllPermissionsQuery());
        return Ok(result);
    }

    [HttpGet("employee/{employeeId:int}/permissions")]
    public async Task<IActionResult> GetUserPermissions(int employeeId)
    {
        var result = await _mediator.Send(new GetUserPermissionsQuery(employeeId));
        return Ok(result);
    }

    [HttpPut("employee/{employeeId:int}/role")]
    public async Task<IActionResult> ChangeEmployeeRole(int employeeId, ChangeEmployeeRoleCommand command)
    {
        command.EmployeeId = employeeId;
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}