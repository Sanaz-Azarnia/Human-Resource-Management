using Application.LeaveRequests.DTOs;
using Domain.Entities;

namespace Application.LeaveRequests.Mappers;

public static class LeaveRequestMapper
{
    public static LeaveRequestDto ToDto(this LeaveRequest leaveRequest)
    {
        return new LeaveRequestDto
        {
            Id = leaveRequest.Id,
            UserId = leaveRequest.EmployeeId,
            Name = leaveRequest.Employee != null
                ? $"{leaveRequest.Employee.Firstname} {leaveRequest.Employee.Lastname}"
                : string.Empty,
            Title = leaveRequest.Title,
            Reason = leaveRequest.Reason,
            StartDate = leaveRequest.StartDate.ToString("yyyy-MM-dd"),
            EndDate = leaveRequest.EndDate.ToString("yyyy-MM-dd"),
            Type = leaveRequest.Type,
            Status = leaveRequest.Status,
            AdminNote = leaveRequest.AdminNote,
            CreatedAt = leaveRequest.CreatedAt.ToString("yyyy-MM-ddTHH:mm:ss")
        };
    }
}