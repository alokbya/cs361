namespace PetReminders.Core.Models;
public class ReminderEvent
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public ReminderEventType EventType { get; set; }
    public DateTime EventTIme { get; set; } = DateTime.UtcNow;

    // Foreign keys
    public required Guid UserId { get; set; }
    public required Guid PetId { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Pet Pet { get; set; } = null!;
}

public enum ReminderEventType
{
    Feeding,
    Walk
}