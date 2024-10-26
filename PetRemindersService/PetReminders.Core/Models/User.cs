namespace PetReminders.Core.Models;

public class User
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string Name { get; set; }
    public required string PasswordHash { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }

    // Navigation properties
    public List<FeedingEvent> FeedingEvents { get; set; } = new();
    public List<Pet> Pets { get; set; } = new();
}