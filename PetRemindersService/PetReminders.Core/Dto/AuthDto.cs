// src/PetReminders.Core/Dto/AuthDto.cs
namespace PetReminders.Core.Dto;

public record LoginRequest(
    string Email,
    string Password
);

public record LoginResponse(
    Guid Id,
    string Email,
    string Name,
    DateTime CreatedAt,
    DateTime? LastLoginAt,
    IEnumerable<Guid> PetNames,
    string Token  // Make sure this is included
);