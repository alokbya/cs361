// src/PetReminders.Api/Endpoints/AuthEndpointExtensions.cs
namespace PetReminders.Api.Endpoints;

public static class AuthEndpointExtensions
{
    public static WebApplication MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/auth")
        .WithTags("Authentication")
        .WithOpenApi();

        group.MapPost("/login", AuthEndpoints.Login)
            .WithName("Login")
            .WithDescription("Authenticates a user and returns their information")
            .AllowAnonymous(); // Important for authentication endpoints

        return app;
    }
}