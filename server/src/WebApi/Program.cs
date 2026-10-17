using Application;
using Application.Common.Interfaces;
using Infrastructure;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebApi.Middleware;
using DotNetEnv;

 
Env.Load();

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables();

// ==================== Services ====================

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
         policy.WithOrigins(
            "http://localhost:3000",    
            "http://yourdomain.com",     
            "https://yourdomain.com"    
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// Add Layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// HttpContextAccessor
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

// ==================== Seed Database ====================
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        
        var context = services.GetRequiredService<AppDbContext>();
        var configuration = services.GetRequiredService<IConfiguration>();
        var passwordHasher = services.GetRequiredService<IPasswordHasher>();

        Console.WriteLine("Starting database migration...");
        
        await context.Database.MigrateAsync();
        
        Console.WriteLine("Migration completed successfully");
        Console.WriteLine("Starting seed data...");

        await SeedData.InitializeAsync(context, configuration, passwordHasher);
        
        Console.WriteLine("Seed data completed successfully");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
        Console.WriteLine($"SEED ERROR: {ex.Message}");
        Console.WriteLine($"STACK: {ex.StackTrace}");
    }
}

// ==================== Middleware Pipeline ====================

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();