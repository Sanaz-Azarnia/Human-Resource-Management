using Domain.Entities;

namespace Application.Common.Interfaces;

public interface ITokenGenerator
{
    string GenerateToken(Employee employee, List<string> permissions);
}