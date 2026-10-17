using Application.Auth.DTOs;
using MediatR;

namespace Application.Auth.Commands.Login;

public class LoginCommand : IRequest<AuthResponseDto>
{
    public string PersonnelId { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}