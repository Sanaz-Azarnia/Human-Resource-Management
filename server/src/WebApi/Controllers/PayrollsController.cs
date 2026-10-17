 using Application.Payrolls.Commands.CreatePayroll;
using Application.Payrolls.Commands.DeletePayroll;
using Application.Payrolls.Commands.UpdatePayroll;
using Application.Payrolls.Queries.GetAllPayrolls;
using Application.Payrolls.Queries.GetPayrollById;
using Application.Payrolls.Queries.GetPayrollsByEmployeeId;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/payroll")]
[Authorize]
public class PayrollsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PayrollsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetAllPayrollsQuery());
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _mediator.Send(new GetPayrollByIdQuery(id));
        return Ok(result);
    }

    [HttpGet("employee/{employeeId:int}")]
    public async Task<IActionResult> GetByEmployeeId(int employeeId)
    {
        var result = await _mediator.Send(new GetPayrollsByEmployeeIdQuery(employeeId));
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreatePayrollCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdatePayrollCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _mediator.Send(new DeletePayrollCommand(id));
        return Ok(result);
    }
}