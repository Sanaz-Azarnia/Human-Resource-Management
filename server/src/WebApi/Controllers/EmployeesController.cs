 using Application.Employees.Commands.CreateEmployee;
using Application.Employees.Commands.DeleteEmployee;
using Application.Employees.Commands.UpdateEmployee;
using Application.Employees.Queries.GetAllEmployees;
using Application.Employees.Queries.GetEmployeeById;
using Application.Employees.Queries.GetEmployeeByPersonnelId;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/employees")]
[Authorize]
public class EmployeesController : ControllerBase
{
    private readonly IMediator _mediator;

    public EmployeesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetAllEmployeesQuery());
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _mediator.Send(new GetEmployeeByIdQuery(id));
        return Ok(result);
    }

    [HttpGet("personnelId/{personnelId}")]
    public async Task<IActionResult> GetByPersonnelId(string personnelId)
    {
        var result = await _mediator.Send(new GetEmployeeByPersonnelIdQuery(personnelId));
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateEmployeeCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateEmployeeCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _mediator.Send(new DeleteEmployeeCommand(id));
        return Ok(result);
    }
}