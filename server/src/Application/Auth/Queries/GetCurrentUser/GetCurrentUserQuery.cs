using Application.Auth.DTOs;
using MediatR;

namespace Application.Auth.Queries.GetCurrentUser;

public class GetCurrentUserQuery : IRequest<UserProfileDto>
{
}