using PetReminders.Api.Endpoints.Pets;
using PetReminders.Core.Interfaces;

public static class PetEndpointExtensions
{
    public static WebApplication MapPetEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/pets")
            .WithTags("Pets")
            .WithOpenApi();

        group.MapGet("/", PetEndpoints.GetAll)
            .WithName("GetAllPets")
            .WithDescription("Gets all pets in the system");

        group.MapGet("/{id}", async (string id, IPetRepository repo) =>
        {
            if (!Guid.TryParse(id, out Guid petId))
                return Results.BadRequest("Invalid ID format");

            return await PetEndpoints.GetById(petId, repo);
        })
            .WithName("GetPetById")
            .WithDescription("Gets a pet by their ID");

        group.MapGet("/user/{userId}", async (string userId, IPetRepository repo) =>
        {
            if (!Guid.TryParse(userId, out Guid guid))
                return Results.BadRequest("Invalid user ID format");

            return await PetEndpoints.GetByUserId(guid, repo);
        })
            .WithName("GetPetsByUserId")
            .WithDescription("Gets all pets for a user");

        group.MapPost("/", PetEndpoints.Create)
            .WithName("CreatePet")
            .WithDescription("Creates a new pet and associates it with a user");

        group.MapPut("/{id}", async (string id, UpdatePetRequest request, IPetRepository repo) =>
        {
            if (!Guid.TryParse(id, out Guid petId))
                return Results.BadRequest("Invalid ID format");

            return await PetEndpoints.Update(petId, request, repo);
        })
            .WithName("UpdatePet")
            .WithDescription("Updates an existing pet");

        group.MapDelete("/{id}", async (string id, IPetRepository repo) =>
        {
            if (!Guid.TryParse(id, out Guid petId))
                return Results.BadRequest("Invalid ID format");

            return await PetEndpoints.Delete(petId, repo);
        })
            .WithName("DeletePet")
            .WithDescription("Deletes a pet");

        group.MapPost("/{id}/users", async (string id, AddUserToPetRequest request, IPetRepository petRepo, IUserRepository userRepo) =>
        {
            if (!Guid.TryParse(id, out Guid petId))
                return Results.BadRequest("Invalid pet ID format");

            if (!Guid.TryParse(request.UserId, out Guid userId))
                return Results.BadRequest("Invalid user ID format");

            return await PetEndpoints.AddUserToPet(petId, userId, petRepo, userRepo);
        })
        .WithName("AddUserToPet")
        .WithDescription("Associates an existing pet with a user");

        return app;
    }
}