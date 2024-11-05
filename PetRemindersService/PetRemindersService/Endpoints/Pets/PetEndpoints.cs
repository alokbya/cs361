using PetReminders.Core.Interfaces;
using PetReminders.Core.Models;

namespace PetReminders.Api.Endpoints.Pets;

public record CreatePetRequest(
    string Name,
    Guid UserId  // The ID of the user creating/owning the pet
);

public record UpdatePetRequest(
    string Name
);

public record PetResponse(
    Guid Id,
    string Name,
    DateTime CreatedAt,
    IEnumerable<Guid> UserIds  // Names of users who can manage this pet
);

public record AddUserToPetRequest(string UserId);


public static class PetEndpoints
{
    public static async Task<IResult> GetAll(IPetRepository repo)
    {
        var pets = await repo.GetAllAsync();
        return Results.Ok(pets.Select(p => new PetResponse(
            p.Id,
            p.Name,
            p.CreatedAt,
            p.Users.Select(u => u.Id)
        )));
    }

    public static async Task<IResult> GetById(Guid id, IPetRepository repo)
    {
        var pet = await repo.GetByIdAsync(id);
        if (pet == null) return Results.NotFound();

        return Results.Ok(new PetResponse(
            pet.Id,
            pet.Name,
            pet.CreatedAt,
            pet.Users.Select(u => u.Id)
        ));
    }

    public static async Task<IResult> GetByUserId(Guid userId, IPetRepository repo)
    {
        var pets = await repo.GetAllAsync();
        var userPets = pets.Where(p => p.Users.Any(u => u.Id == userId));
        if (pets == null) return Results.Ok(new List<PetResponse>());

        return Results.Ok(userPets.Select(p => new PetResponse(
            p.Id,
            p.Name,
            p.CreatedAt,
            p.Users.Select(u => u.Id)
        )));
    }

    public static async Task<IResult> Create(
        CreatePetRequest request,
        IPetRepository petRepo,
        IUserRepository userRepo)
    {
        // Verify user exists
        var user = await userRepo.GetByIdAsync(request.UserId);
        if (user == null) return Results.NotFound("User not found");

        var pet = new Pet
        {
            Name = request.Name,
            CreatedAt = DateTime.UtcNow,
            Users = new List<User> { user }
        };

        var created = await petRepo.AddAsync(pet);

        return Results.Created($"/pets/{created.Id}", new PetResponse(
            created.Id,
            created.Name,
            created.CreatedAt,
            created.Users.Select(u => u.Id)
        ));
    }

    public static async Task<IResult> Update(
        Guid id,
        UpdatePetRequest request,
        IPetRepository repo)
    {
        var existingPet = await repo.GetByIdAsync(id);
        if (existingPet == null) return Results.NotFound();

        existingPet.Name = request.Name;

        var updated = await repo.UpdateAsync(existingPet);
        if (updated == null) return Results.NotFound();

        return Results.Ok(new PetResponse(
            updated.Id,
            updated.Name,
            updated.CreatedAt,
            updated.Users.Select(u => u.Id)
        ));
    }

    public static async Task<IResult> Delete(
        Guid id,
        IPetRepository repo)
    {
        var result = await repo.DeleteAsync(id);
        return result ? Results.Ok() : Results.NotFound();
    }

    public static async Task<IResult> AddUserToPet(
    Guid petId,
    Guid userId,
    IPetRepository petRepo,
    IUserRepository userRepo)
    {
        var pet = await petRepo.GetByIdAsync(petId);
        if (pet == null) return Results.NotFound("Pet not found");

        var user = await userRepo.GetByIdAsync(userId);
        if (user == null) return Results.NotFound("User not found");

        // Check if user already has this pet
        if (pet.Users.Any(u => u.Id == userId))
            return Results.BadRequest("User already has access to this pet");

        pet.Users.Add(user);
        await petRepo.UpdateAsync(pet);

        return Results.Ok(new PetResponse(
            pet.Id,
            pet.Name,
            pet.CreatedAt,
            pet.Users.Select(u => u.Id)
        ));
    }

    public static async Task<IResult> RemoveUserFromPet(
    Guid petId,
    Guid userId,
    IPetRepository petRepo,
    IUserRepository userRepo)
    {
        var pet = await petRepo.GetByIdAsync(petId);
        if (pet == null) return Results.NotFound("Pet not found");

        var user = await userRepo.GetByIdAsync(userId);
        if (user == null) return Results.NotFound("User not found");

        // Check if this is the last user
        if (pet.Users.Count == 1)
            return Results.BadRequest("Cannot remove the last user from a pet");

        pet.Users.Remove(user);
        await petRepo.UpdateAsync(pet);

        return Results.Ok();
    }
}