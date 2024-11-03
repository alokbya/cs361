namespace PetReminders.Core.Models;
public class Pet
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Name { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public List<User> Users { get; set; } = new(); // Allows multiple family members
    public List<ReminderEvent> FeedingEvents { get; set; } = new();
    public List<Schedule> FeedingSchedules { get; set; } = new();
}