 using Application.Employees.DTOs;
using Application.Employees.Mappers;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Employees.Commands.UpdateEmployee;

public class UpdateEmployeeCommandHandler : IRequestHandler<UpdateEmployeeCommand, EmployeeDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IPermissionService _permissionService;
    private readonly IPasswordHasher _passwordHasher;

    public UpdateEmployeeCommandHandler(
        IApplicationDbContext context,
        ICurrentUserService currentUser,
        IPermissionService permissionService,
        IPasswordHasher passwordHasher)
    {
        _context = context;
        _currentUser = currentUser;
        _permissionService = permissionService;
        _passwordHasher = passwordHasher;
    }

    public async Task<EmployeeDto> Handle(UpdateEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.Id == request.Id, cancellationToken);

        if (employee == null)
            throw new NotFoundException("Employee", request.Id);

         
        bool isOwner = employee.Id == _currentUser.UserId;
        bool canEditAll = await _permissionService.HasPermissionAsync(_currentUser.UserId, "employee:edit:all");
        bool canEditOwn = await _permissionService.HasPermissionAsync(_currentUser.UserId, "employee:edit:own");

        if (!isOwner && !canEditAll)
            throw new ForbiddenException("You don't have permission to edit this employee");

        if (isOwner && !canEditOwn && !canEditAll)
            throw new ForbiddenException("You don't have permission to edit your own profile");

         
        employee.UpdatePersonalInfo(
            request.Firstname,
            request.Lastname,
            request.Email,
            request.Phone,
            request.Address,
            request.AvatarUrl
        );

        employee.ChangeRole(request.RoleId);
        employee.AdjustBaseSalary(request.BaseSalary);

        if (!string.IsNullOrEmpty(request.Password))
        {
            employee.UpdatePasswordHash(_passwordHasher.Hash(request.Password));
        }

        await _context.SaveChangesAsync(cancellationToken);

         
        var result = await _context.Employees
            .Include(e => e.Role)
            .FirstAsync(e => e.Id == employee.Id, cancellationToken);

          
        return result.ToDto();
    }
}