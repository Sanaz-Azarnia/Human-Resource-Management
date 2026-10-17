using Application.Common.Interfaces;

namespace Application.Common.Services;

public class DateTimeProvider : IDateTimeProvider
{
    public DateTime UtcNow => DateTime.UtcNow;
}