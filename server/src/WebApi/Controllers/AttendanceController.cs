using Application.Attendance.Commands.CreateAttendance;
using Application.Attendance.Commands.CreateAttendanceSheet;
using Application.Attendance.Commands.DeleteAttendance;
using Application.Attendance.Commands.PresentAttendance;
using Application.Attendance.Commands.AbsentAttendance;
using Application.Attendance.Commands.SubmitAttendance;
using Application.Attendance.Commands.UpdateAttendance;
using Application.Attendance.DTOs;
using Application.Attendance.Queries.GetAllAttendance;
using Application.Attendance.Queries.GetAllAttendanceSheets;
using Application.Attendance.Queries.GetActiveAttendanceSheets;
using Application.Attendance.Queries.GetAttendanceById;
using Application.Attendance.Queries.GetAttendanceByEmployeeId;
using Application.Attendance.Queries.GetDailyAttendanceReport;
using Application.Attendance.Queries.GetSheetReport;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[ApiController]
[Route("api/attendance")]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly IMediator _mediator;

    public AttendanceController(IMediator mediator)
    {
        _mediator = mediator;
    }

    // ==================== Attendance Records ====================

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetAllAttendanceQuery());
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _mediator.Send(new GetAttendanceByIdQuery(id));
        return Ok(result);
    }

    [HttpGet("employee/{employeeId:int}")]
    public async Task<IActionResult> GetByEmployeeId(int employeeId)
    {
        var result = await _mediator.Send(new GetAttendanceByEmployeeIdQuery(employeeId));
        return Ok(result);
    }

    [HttpGet("report")]
    public async Task<IActionResult> GetDailyReport([FromQuery] DateTime date)
    {
        var result = await _mediator.Send(new GetDailyAttendanceReportQuery { Date = date });
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateAttendanceCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateAttendanceCommand command)
    {
        command.Id = id;
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _mediator.Send(new DeleteAttendanceCommand(id));
        return Ok(result);
    }

    [HttpPut("{id:int}/present")]
    public async Task<IActionResult> Present(int id)
    {
        var result = await _mediator.Send(new PresentAttendanceCommand(id));
        return Ok(result);
    }

    [HttpPut("{id:int}/absent")]
    public async Task<IActionResult> Absent(int id)
    {
        var result = await _mediator.Send(new AbsentAttendanceCommand(id));
        return Ok(result);
    }

    // ==================== Attendance Sheets ====================

    [HttpPost("sheets")]
    public async Task<IActionResult> CreateSheet([FromBody] CreateAttendanceSheetCommand command)
    {
        var id = await _mediator.Send(command);
        return Ok(id);
    }

    [HttpGet("sheets")]
    public async Task<IActionResult> GetAllSheets()
    {
        var result = await _mediator.Send(new GetAllAttendanceSheetsQuery());
        return Ok(result);
    }

    [HttpGet("sheets/active")]
    public async Task<IActionResult> GetActiveSheets()
    {
        var result = await _mediator.Send(new GetActiveAttendanceSheetsQuery());
        return Ok(result);
    }

    [HttpGet("sheets/{sheetId:int}/report")]
    public async Task<IActionResult> GetSheetReport(int sheetId)
    {
        var result = await _mediator.Send(new GetSheetReportQuery(sheetId));
        return Ok(result);
    }

    // ==================== Attendance Submit ====================

    [HttpPost("submit")]
    public async Task<IActionResult> Submit([FromBody] SubmitAttendanceCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}