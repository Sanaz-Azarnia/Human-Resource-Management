 using Application.LeaveRequests.Commands.CreateLeaveRequest;
using Application.LeaveRequests.Commands.DeleteLeaveRequest;
using Application.LeaveRequests.Commands.UpdateLeaveRequest;
using Application.LeaveRequests.Commands.ApproveLeaveRequest;
using Application.LeaveRequests.Commands.RejectLeaveRequest;
using Application.LeaveRequests.Queries.GetAllLeaveRequests;
using Application.LeaveRequests.Queries.GetLeaveRequestById;
using Application.LeaveRequests.Queries.GetLeaveRequestsByEmployeeId;
using Application.LeaveRequests.Queries.GetPendingLeaveRequests;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/leave")]
[Authorize]
public class LeaveRequestsController : ControllerBase
{
    private readonly IMediator _mediator;

    public LeaveRequestsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetAllLeaveRequestsQuery());
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _mediator.Send(new GetLeaveRequestByIdQuery(id));
        return Ok(result);
    }

    [HttpGet("employee/{employeeId:int}")]
    public async Task<IActionResult> GetByEmployeeId(int employeeId)
    {
        var result = await _mediator.Send(new GetLeaveRequestsByEmployeeIdQuery(employeeId));
        return Ok(result);
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPending()
    {
        var result = await _mediator.Send(new GetPendingLeaveRequestsQuery());
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateLeaveRequestCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateLeaveRequestCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _mediator.Send(new DeleteLeaveRequestCommand(id));
        return Ok(result);
    }

    [HttpPut("{id:int}/approve")]
    public async Task<IActionResult> Approve(int id, ApproveLeaveRequestCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id:int}/reject")]
    public async Task<IActionResult> Reject(int id, RejectLeaveRequestCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}