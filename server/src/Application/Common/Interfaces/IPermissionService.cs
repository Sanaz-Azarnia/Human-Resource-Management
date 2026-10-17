namespace Application.Common.Interfaces;

public interface IPermissionService
{
    Task<bool> HasPermissionAsync(int userId, string permission);
    Task<List<string>> GetUserPermissionsAsync(int userId);
}