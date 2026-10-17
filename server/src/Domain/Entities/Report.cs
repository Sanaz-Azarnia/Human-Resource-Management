using Domain.Common;

namespace Domain.Entities;

public class Report : BaseEntity
{
    public int EmployeeId { get; private set; }
    public Employee? Employee { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Content { get; private set; } = string.Empty;
    public string Type { get; private set; } = string.Empty;
    public string? AttachmentUrl { get; private set; }
    public DateTime CreatedAt { get; private set; }

    // Parameterless constructor for EF Core
    protected Report() { }

    // Factory Method
    public static Report Create(int employeeId, string title, string content, string type, string? attachmentUrl = null)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Report title cannot be empty.");

        return new Report
        {
            EmployeeId = employeeId,
            Title = title,
            Content = content,
            Type = type,
            AttachmentUrl = attachmentUrl,
            CreatedAt = DateTime.UtcNow
        };
    }

    // Behaviors
    public void UpdateDetails(string title, string content, string type, string? attachmentUrl)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Report title cannot be empty.");

        Title = title;
        Content = content;
        Type = type;
        AttachmentUrl = attachmentUrl;
    }
}