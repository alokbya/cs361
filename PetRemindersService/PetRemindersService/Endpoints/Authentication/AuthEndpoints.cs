// src/PetReminders.Api/Endpoints/AuthEndpoints.cs
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using PetReminders.Core.Dto;
using PetReminders.Core.Interfaces;
using PetReminders.Core.Models;
using PetReminders.Core.Services;

namespace PetReminders.Api.Endpoints;

public static class AuthEndpoints
{
    public static async Task<IResult> Login(
        LoginRequest request,
        IUserRepository userRepo,
        IPasswordService passwordService)
    {
        // Find user by email
        var user = await userRepo.GetByEmailAsync(request.Email);
        if (user == null)
        {
            return Results.Unauthorized();
        }

        // Verify password
        if (!passwordService.VerifyPassword(user.PasswordHash, request.Password))
        {
            return Results.Unauthorized();
        }

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await userRepo.UpdateAsync(user.Id, user);

        // Return user info (you might want to add JWT token generation here)
        return Results.Ok(new LoginResponse(
            user.Id,
            user.Email,
            user.Name,
            user.CreatedAt,
            user.LastLoginAt,
            user.Pets.Select(p => p.Id),
            "dummy-token" // Replace with actual JWT token if implementing
        ));
    }


    // Add this to your UserEndpoints.cs Create method
    public static async Task<IResult> Create(CreateUserRequest request,
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
    
    private static bool IsDuplicateEmailException(DbUpdateException ex)
    {
        return ex.InnerException is SqliteException sqliteEx &&
               (sqliteEx.SqliteErrorCode == 19 || // SQLite UNIQUE constraint error
                sqliteEx.Message.Contains("UNIQUE constraint failed"));
    }
}