namespace Application.Auth.DTOs;

public class UserProfileDto
{
    public int UserId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public int RoleId { get; set; }
    public string PersonnelId { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public List<string> Permissions { get; set; } = new();
}