public static class ReminderEventEndpointExtensions
{
    public static WebApplication MapReminderEventEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/reminderevents")
            .WithTags("Reminder Events")
            .WithOpenApi();

        group.MapGet("/", ReminderEventEndpoints.GetAll)
            .WithName("GetAllReminderEvents")
            .WithDescription("Gets all reminder events");

        group.MapGet("/{id}", async (string id, IReminderEventRepository repo) =>
        {
            if (!Guid.TryParse(id, out Guid eventId))
                return Results.BadRequest("Invalid ID format");

            return await ReminderEventEndpoints.GetById(eventId, repo);
        })
        .WithName("GetReminderEventById")
        .WithDescription("Gets a reminder event by ID");

        group.MapGet("/pet/{petId}", async (string petId, IReminderEventRepository repo) =>
        {
            if (!Guid.TryParse(petId, out Guid guid))
                return Results.BadRequest("Invalid pet ID format");

            return await ReminderEventEndpoints.GetByPet(guid, repo);
        })
        .WithName("GetReminderEventsByPet")
        .WithDescription("Gets all reminder events for a pet");

        group.MapGet("/pet/{petId}/latest", async (string petId, IReminderEventRepository repo) =>
        {
            if (!Guid.TryParse(petId, out Guid guid))
                return Results.BadRequest("Invalid pet ID format");

            return await ReminderEventEndpoints.GetLatestByPetId(guid, repo);
        })
        .WithName("GetLatestReminderEventByPet")
        .WithDescription("Gets the latest reminder event for a pet");

        group.MapPost("/", ReminderEventEndpoints.Create)
            .WithName("CreateReminderEvent")
            .WithDescription("Creates a new reminder event");

        group.MapDelete("/{id}", async (string id, IReminderEventRepository repo) =>
        {
            if (!Guid.TryParse(id, out Guid eventId))
                return Results.BadRequest("Invalid ID format");

            return await ReminderEventEndpoints.Delete(eventId, repo);
        })
        .WithName("DeleteReminderEvent")
        .WithDescription("Deletes a reminder event");

        return app;
    }
}