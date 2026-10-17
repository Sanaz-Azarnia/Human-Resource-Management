 using Application.Employees.DTOs;
using Application.Employees.Mappers;
using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Employees.Commands.CreateEmployee;

public class CreateEmployeeCommandHandler : IRequestHandler<CreateEmployeeCommand, EmployeeDto>
{
    private readonly IApplicationDbContext _context;
    private readonly IPasswordHasher _passwordHasher;

    public CreateEmployeeCommandHandler(
        IApplicationDbContext context,
        IPasswordHasher passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    public async Task<EmployeeDto> Handle(CreateEmployeeCommand request, CancellationToken cancellationToken)
    {
        var personnelId = await GenerateUniquePersonnelIdAsync(cancellationToken);

        var employee = Employee.Create(
            firstname: request.Firstname,
            lastname: request.Lastname,
            personnelId: personnelId,
            nationalId: request.NationalId,
            email: request.Email,
            phone: request.Phone,
            passwordHash: _passwordHasher.Hash(request.Password),
            address: request.Address,
            roleId: request.RoleId,
            baseSalary: request.BaseSalary,
            avatarUrl: request.AvatarUrl
        );

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync(cancellationToken);

        
        var result = await _context.Employees
            .Include(e => e.Role)
            .FirstAsync(e => e.Id == employee.Id, cancellationToken);

        
        return result.ToDto();
    }

    private async Task<string> GenerateUniquePersonnelIdAsync(CancellationToken cancellationToken)
    {
        var random = new Random();
        string personnelId;
        bool exists;

        do
        {
            int number = random.Next(10000000, 100000000);
            personnelId = number.ToString();
            exists = await _context.Employees
                .AnyAsync(e => e.PersonnelId == personnelId, cancellationToken);
        } while (exists);

        return personnelId;
    }
}