 using Application.Common.Exceptions;
using System.Text.Json;

namespace WebApi.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var (statusCode, message) = exception switch
        {
            UnauthorizedException => (StatusCodes.Status401Unauthorized, exception.Message),
            ForbiddenException => (StatusCodes.Status403Forbidden, exception.Message),
            NotFoundException => (StatusCodes.Status404NotFound, exception.Message),
            FluentValidation.ValidationException => (StatusCodes.Status400BadRequest, "Validation failed"),
            Domain.Common.DomainException => (StatusCodes.Status400BadRequest, exception.Message),
            _ => (StatusCodes.Status500InternalServerError, "An internal error occurred")
        };

        context.Response.StatusCode = statusCode;

        var response = new
        {
            error = message,
            status = statusCode
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}