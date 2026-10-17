using Domain.Entities;
using Xunit;

namespace Application.Tests.LeaveRequests;

public class LeaveRequestDomainTests
{
    [Fact]
    public void LeaveRequest_ShouldBeCreated_WithPendingStatus()
    {
         
        var leaveRequest = LeaveRequest.Create(
            employeeId: 1,
            title: "Entitled leave",
            reason: "Trip",
            startDate: new DateTime(2024, 10, 20),
            endDate: new DateTime(2024, 10, 22),
            type: "Entitled" 
        );

         
        Assert.Equal("Pending", leaveRequest.Status);
        Assert.Equal(1, leaveRequest.EmployeeId);
    }

    [Fact]
    public void LeaveRequest_ShouldApprove_WhenPending()
    {
         
        var leaveRequest = LeaveRequest.Create(
            employeeId: 1,
            title: "Leave request",
            reason: "Trip",
            startDate: new DateTime(2024, 10, 20),
            endDate: new DateTime(2024, 10, 22),
            type: "Entitled"
        );

         
        leaveRequest.Approve("Approved");

         
        Assert.Equal("Approved", leaveRequest.Status);
        Assert.Equal("Approved", leaveRequest.AdminNote);
    }

    [Fact]
    public void LeaveRequest_ShouldNotApprove_WhenAlreadyApproved()
    {
         
        var leaveRequest = LeaveRequest.Create(
            employeeId: 1,
            title: "Leave request",
            reason: "Trip",
            startDate: new DateTime(2024, 10, 20),
            endDate: new DateTime(2024, 10, 22),
            type: "Entitled" 
        );

        leaveRequest.Approve("Approved");

         
        Assert.Throws<Domain.Common.DomainException>(() =>
        {
            leaveRequest.Approve("Re-approval");
        });
    }

    [Fact]
    public void LeaveRequest_ShouldNotCreate_WhenEndDateBeforeStartDate()
    {
         
        Assert.Throws<Domain.Common.DomainException>(() =>
        {
            LeaveRequest.Create(
                employeeId: 1,
                title: "Leave request",
                reason: "Trip",
                startDate: new DateTime(2024, 10, 22),
                endDate: new DateTime(2024, 10, 20),
                type: "Entitled"
            );
        });
    }
}