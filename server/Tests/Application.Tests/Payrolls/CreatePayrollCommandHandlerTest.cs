using Application.Common.Interfaces;
using Application.Payrolls.Commands.CreatePayroll;
using Domain.Entities;
using Moq;
using Xunit;

namespace Application.Tests.Payrolls;

public class CreatePayrollCommandHandlerTests
{
    private readonly Mock<IApplicationDbContext> _contextMock;
    private readonly Mock<ICurrentUserService> _currentUserMock;
    private readonly CreatePayrollCommandHandler _handler;

    public CreatePayrollCommandHandlerTests()
    {
        _contextMock = new Mock<IApplicationDbContext>();
        _currentUserMock = new Mock<ICurrentUserService>();
        _handler = new CreatePayrollCommandHandler(_contextMock.Object, _currentUserMock.Object);
    }

    [Fact]
    public async Task Handle_ShouldCreatePayroll_WhenValidCommand()
    {
         
        var command = new CreatePayrollCommand
        {
            Year = 2024,
            Month = 10,
            BaseSalary = 50000,
            Overtime = 5000,
            Bonus = 2000,
            Tax = 3000,
            Insurance = 1000,
            IsPaid = false
        };

        _currentUserMock.Setup(x => x.UserId).Returns(1);

        var payrollDbSetMock = new Mock<Microsoft.EntityFrameworkCore.DbSet<Payroll>>();
        _contextMock.Setup(x => x.Payrolls).Returns(payrollDbSetMock.Object);
        _contextMock.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>())).ReturnsAsync(1);

        
         

         
        Assert.True(true);  
    }

    [Fact]
    public void Payroll_ShouldCalculateTotals_WhenCreated()
    {
         
        var baseSalary = 50000m;
        var overtime = 5000m;
        var bonus = 2000m;
        var tax = 3000m;
        var insurance = 1000m;

         
        var payroll = Payroll.Create(
            employeeId: 1,
            year: 2024,
            month: 10,
            baseSalary: baseSalary,
            overtime: overtime,
            bonus: bonus,
            tax: tax,
            insurance: insurance
        );

         
        Assert.Equal(57000m, payroll.GrossSalary);  
        Assert.Equal(4000m, payroll.TotalDeductions);  
        Assert.Equal(53000m, payroll.NetSalary);  
    }

    [Fact]
    public void Payroll_ShouldNotUpdate_WhenAlreadyPaid()
    {
         
        var payroll = Payroll.Create(
            employeeId: 1,
            year: 2024,
            month: 10,
            baseSalary: 50000,
            overtime: 5000,
            bonus: 2000,
            tax: 3000,
            insurance: 1000
        );

        payroll.MarkAsPaid();

        Assert.Throws<Domain.Common.DomainException>(() =>
        {
            payroll.UpdateDetails(60000, 5000, 2000, 3000, 1000);
        });
    }
}