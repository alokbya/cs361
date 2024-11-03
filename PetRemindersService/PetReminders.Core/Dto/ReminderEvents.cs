using PetReminders.Core.Models;

public record CreateReminderEventRequest(
    Guid PetId,
    Guid UserId,
    ReminderEventType EventType
);

public record ReminderEventResponse(
    Guid Id,
    ReminderEventType EventType,
    DateTime EventTime,
    string UserName,
    string PetName
);