using Application.Common.Interfaces;
using Infrastructure.Auth;
using Infrastructure.Persistence;
using Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
         
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

         
        services.AddScoped<IApplicationDbContext>(provider => 
            provider.GetRequiredService<AppDbContext>());

        
        services.AddScoped<IPasswordHasher, PasswordHasher>();
        services.AddScoped<ITokenGenerator, TokenGenerator>();

         
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IPermissionService, PermissionService>();

        return services;
    }
}