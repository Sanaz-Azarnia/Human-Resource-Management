 using Application.Reports.Commands.CreateReport;
using Application.Reports.Commands.DeleteReport;
using Application.Reports.Commands.UpdateReport;
using Application.Reports.Queries.GetAllReports;
using Application.Reports.Queries.GetReportById;
using Application.Reports.Queries.GetReportsByEmployeeId;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/report")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ReportsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetAllReportsQuery());
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _mediator.Send(new GetReportByIdQuery(id));
        return Ok(result);
    }

    [HttpGet("employee/{employeeId:int}")]
    public async Task<IActionResult> GetByEmployeeId(int employeeId)
    {
        var result = await _mediator.Send(new GetReportsByEmployeeIdQuery(employeeId));
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateReportCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateReportCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _mediator.Send(new DeleteReportCommand(id));
        return Ok(result);
    }
}