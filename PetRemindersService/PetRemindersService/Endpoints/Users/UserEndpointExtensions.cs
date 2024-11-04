using Microsoft.OpenApi.Models;
using Microsoft.OpenApi.Any;
using PetReminders.Core.Dto;
using PetReminders.Core.Interfaces;

namespace PetReminders.Api.Endpoints.Users;

public static class UserEndpointExtensions
{
    public static WebApplication MapUserEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/users")
            .WithTags("Users")
            .WithOpenApi();

        group.MapGet("/", UserEndpoints.GetAll)
            .WithName("GetAllUsers")
            .WithDescription("Gets all users in the system");

        group.MapGet("/{id}", async (string id, IUserRepository repo) =>
        {
            if (!Guid.TryParse(id, out Guid userId))
                return Results.BadRequest("Invalid ID format");

            return await UserEndpoints.GetById(userId, repo);
        })
            .WithName("GetUserById")
            .WithDescription("Gets a user by their ID")
            .WithOpenApi(operation =>
            {
                operation.Parameters[0].Description = "The GUID identifier of the user";
                operation.Parameters[0].Example = new OpenApiString("123e4567-e89b-12d3-a456-426614174000");
                return operation;
            });

        // Make sure this endpoint is mapped
        group.MapPost("/", UserEndpoints.Create)
            .WithName("CreateUser")
            .WithDescription("Creates a new user")
            .AllowAnonymous();  // Important! This allows unauthenticated access

        group.MapPut("/{id}", async (string id, UpdateUserRequest request, IUserRepository repo) =>
        {
            if (!Guid.TryParse(id, out Guid userId))
                return Results.BadRequest("Invalid ID format");

            return await UserEndpoints.Update(userId, request, repo);
        })
            .WithName("UpdateUser")
            .WithDescription("Updates an existing user");

        group.MapDelete("/{id}", async (string id, IUserRepository repo) =>
        {
            if (!Guid.TryParse(id, out Guid userId))
                return Results.BadRequest("Invalid ID format");

            return await UserEndpoints.Delete(userId, repo);
        })
            .WithName("DeleteUser")
            .WithDescription("Deletes a user");

        return app;
    }

    private static bool IsValidEmail(string email)
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(email);
            return addr.Address == email;
        }
        catch
        {
            return false;
        }
    }
}