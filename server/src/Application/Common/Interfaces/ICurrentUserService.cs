namespace Application.Common.Interfaces;

public interface ICurrentUserService
{
    int UserId { get; }
    string PersonnelId { get; }
    string FullName { get; }
    int RoleId { get; }
    bool IsAuthenticated { get; }
}