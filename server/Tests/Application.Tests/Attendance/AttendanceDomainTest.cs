using Domain.Entities;
using Xunit;

namespace Application.Tests.Attendance;

public class AttendanceDomainTests
{
    [Fact]
    public void Attendance_ShouldBeCreated_WithDefaultValues()
    {
         
        var attendance = Domain.Entities.Attendance.Create(
            sheetId: 1,
            employeeId: 1,
            date: new DateTime(2024, 10, 15)
        );

         
        Assert.Equal(1, attendance.EmployeeId);
        Assert.Equal(new DateTime(2024, 10, 15), attendance.Date);
        Assert.False(attendance.IsPresent);
        Assert.Null(attendance.CheckIn);
        Assert.Null(attendance.CheckOut);
    }

    [Fact]
    public void Attendance_ShouldMarkAsPresent_WhenCheckInRecorded()
    {
         
        var attendance = Domain.Entities.Attendance.Create(
            sheetId: 1,
            employeeId: 1,
            date: new DateTime(2024, 10, 15)
        );

        
        attendance.RecordCheckIn(new TimeSpan(8, 30, 0));

         
        Assert.True(attendance.IsPresent);
        Assert.Equal(new TimeSpan(8, 30, 0), attendance.CheckIn);
    }

    [Fact]
    public void Attendance_ShouldNotCheckOut_BeforeCheckIn()
    {
         
        var attendance = Domain.Entities.Attendance.Create(
            sheetId: 1,
            employeeId: 1,
            date: new DateTime(2024, 10, 15)
        );

         
        Assert.Throws<Domain.Common.DomainException>(() =>
        {
            attendance.RecordCheckOut(new TimeSpan(17, 30, 0));
        });
    }

    [Fact]
    public void Attendance_ShouldCheckOut_AfterCheckIn()
    {
         
        var attendance = Domain.Entities.Attendance.Create(
            sheetId: 1,
            employeeId: 1,
            date: new DateTime(2024, 10, 15)
        );

        attendance.RecordCheckIn(new TimeSpan(8, 30, 0));

         
        attendance.RecordCheckOut(new TimeSpan(17, 30, 0));

        
        Assert.Equal(new TimeSpan(17, 30, 0), attendance.CheckOut);
    }

    [Fact]
    public void Attendance_ShouldMarkAsAbsent_WhenMarkAsAbsentCalled()
    {
         
        var attendance = Domain.Entities.Attendance.Create(
            sheetId: 1,
            employeeId: 1,
            date: new DateTime(2024, 10, 15)
        );

        attendance.RecordCheckIn(new TimeSpan(8, 30, 0));

         
        attendance.MarkAsAbsent("Leave request");

         
        Assert.False(attendance.IsPresent);
        Assert.Null(attendance.CheckIn);
        Assert.Null(attendance.CheckOut);
        Assert.Equal("Leave request", attendance.Notes);
    }
}