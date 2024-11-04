using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PetReminders.Core.Dto;
using PetReminders.Core.Interfaces;
using PetReminders.Core.Models;
using PetReminders.Core.Services;

namespace PetReminders.Api.Endpoints.Users;

public static class UserEndpoints
{
    public static async Task<IResult> GetAll(IUserRepository repo)
    {
        var users = await repo.GetAllAsync();
        return Results.Ok(users.Select(u => new UserResponse(
            u.Id,
            u.Email,
            u.Name,
            u.CreatedAt,
            u.LastLoginAt,
            u.Pets.Select(p => p.Name)
        )));
    }

    public static async Task<IResult> GetById(Guid id, IUserRepository repo)
    {
        var user = await repo.GetByIdAsync(id);
        if (user == null) return Results.NotFound();

        return Results.Ok(new UserResponse(
            user.Id,
            user.Email,
            user.Name,
            user.CreatedAt,
            user.LastLoginAt,
            user.Pets.Select(p => p.Name)
        ));
    }

    public static async Task<IResult> Create(
    CreateUserRequest request,
    IUserRepository repo,
    IPasswordService passwordService)
    {
        if (!request.IsValidEmail())
            return Results.BadRequest("Invalid email format");

        try
        {
            // Check if email exists first
            var existingUser = await repo.GetByEmailAsync(request.Email);
            if (existingUser != null)
                return Results.BadRequest("Email address is already registered");

            var user = new User
            {
                Email = request.Email,
                Name = request.Name,
                PasswordHash = passwordService.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow
            };

            var created = await repo.CreateAsync(user);

            return Results.Created($"/users/{created.Id}",
                new UserResponse(
                    created.Id,
                    created.Email,
                    created.Name,
                    created.CreatedAt,
                    created.LastLoginAt,
                    created.Pets.Select(p => p.Name)
                ));
        }
        catch (DbUpdateException ex) when (IsDuplicateEmailException(ex))
        {
            return Results.Conflict("Email address is already registered");
        }
    }

    public static async Task<IResult> Update(Guid id, UpdateUserRequest request, IUserRepository repo)
    {
        try
        {
            var existing = await repo.GetByEmailAsync(request.Email);
            if (existing != null && existing.Id != id)
                return Results.BadRequest("Email address is already taken by another user");

            var user = new User
            {
                Id = id,
                Email = request.Email,
                Name = request.Name,
                PasswordHash = request.Password ?? existing?.PasswordHash ?? string.Empty
            };

            var updated = await repo.UpdateAsync(id, user);
            if (updated == null) return Results.NotFound();

            return Results.Ok(new UserResponse(
                updated.Id,
                updated.Email,
                updated.Name,
                updated.CreatedAt,
                updated.LastLoginAt,
                updated.Pets.Select(p => p.Name)
            ));
        }
        catch (DbUpdateException ex) when (IsDuplicateEmailException(ex))
        {
            return Results.Conflict("Email address is already taken by another user");
        }
    }

    // Helper method to identify duplicate key exceptions
    private static bool IsDuplicateEmailException(DbUpdateException ex)
    {
        return ex.InnerException is SqliteException sqliteEx &&
               (sqliteEx.SqliteErrorCode == 19 || // SQLite UNIQUE constraint error
                sqliteEx.Message.Contains("UNIQUE constraint failed"));
    }

    public static async Task<IResult> Delete(Guid id, IUserRepository repo)
    {
        var result = await repo.DeleteAsync(id);
        return result ? Results.Ok() : Results.NotFound();
    }
}