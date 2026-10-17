using Application.Attendance.DTOs;
using Domain.Entities;

namespace Application.Attendance.Mappers;

public static class AttendanceMapper
{
    public static AttendanceDto ToDto(this Domain.Entities.Attendance attendance)
    {
        return new AttendanceDto
        {
            Id = attendance.Id,
            UserId = attendance.EmployeeId,
            Name = attendance.Employee != null 
                ? $"{attendance.Employee.Firstname} {attendance.Employee.Lastname}" 
                : string.Empty,
            Date = attendance.Date.ToString("yyyy-MM-dd"),
            CheckIn = attendance.CheckIn?.ToString(@"hh\:mm"),
            CheckOut = attendance.CheckOut?.ToString(@"hh\:mm"),
            IsPresent = attendance.IsPresent,
            Notes = attendance.Notes
        };
    }
}