namespace Application.Auth.DTOs;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string Firstname { get; set; } = string.Empty;
    public string Lastname { get; set; } = string.Empty;
    public int RoleId { get; set; }
    public string? AvatarUrl { get; set; }
    public List<string> Permissions { get; set; } = new();
}