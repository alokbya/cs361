using PetReminders.Core.Interfaces;
using PetReminders.Core.Models;

public static class ReminderEventEndpoints
{
    public static async Task<IResult> GetAll(IReminderEventRepository repo)
    {
        var events = await repo.GetAllAsync();
        return Results.Ok(events.Select(ToResponse));
    }

    public static async Task<IResult> GetById(Guid id, IReminderEventRepository repo)
    {
        var reminderEvent = await repo.GetByIdAsync(id);
        if (reminderEvent == null) return Results.NotFound();

        return Results.Ok(ToResponse(reminderEvent));
    }

    public static async Task<IResult> GetByPet(
        Guid petId,
        IReminderEventRepository repo)
    {
        var events = await repo.GetByPetIdAsync(petId);
        return Results.Ok(events.Select(ToResponse));
    }

    public static async Task<IResult> GetLatestByPetId(Guid petId, IReminderEventRepository repo)
    {
        var events = await repo.GetRecentByPetIdAsync(petId, 1);
        if (events.Count == 0) return Results.Ok(new List<ReminderEventResponse>());
        return Results.Ok(events.Select(ToResponse));
    }

    public static async Task<IResult> Create(
        CreateReminderEventRequest request,
        IReminderEventRepository repo,
        IPetRepository petRepo,
        IUserRepository userRepo)
    {
        // Verify pet and user exist
        var pet = await petRepo.GetByIdAsync(request.PetId);
        if (pet == null) return Results.NotFound("Pet not found");

        var user = await userRepo.GetByIdAsync(request.UserId);
        if (user == null) return Results.NotFound("User not found");

        var reminderEvent = new ReminderEvent
        {
            PetId = request.PetId,
            UserId = request.UserId,
            EventType = request.EventType
        };

        var created = await repo.AddAsync(reminderEvent);
        return Results.Created($"/reminderevents/{created.Id}", ToResponse(created));
    }

    private static ReminderEventResponse ToResponse(ReminderEvent e) => new(
        e.Id,
        e.EventType,
        e.EventTIme,
        e.User.Name,
        e.Pet.Name
    );
}