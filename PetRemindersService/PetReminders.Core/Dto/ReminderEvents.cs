using PetReminders.Core.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

public record CreateReminderEventRequest(
    Guid PetId,
    Guid UserId,
    ReminderEventType EventType
);

public record ReminderEventResponse(
    Guid Id,
    ReminderEventType EventType,
    DateTime EventTime,
    string UserName,  // Just the name, not the whole user object
    string PetName    // Just the name, not the whole pet object
);


