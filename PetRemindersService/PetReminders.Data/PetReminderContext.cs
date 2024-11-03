using Microsoft.EntityFrameworkCore;
using PetReminders.Core.Models;

public class PetReminderContext : DbContext
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Pet> Pets { get; set; } = null!;
    public DbSet<ReminderEvent> ReminderEvents { get; set; } = null!;


    public PetReminderContext(DbContextOptions<PetReminderContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Add this unique index for email
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Existing configurations
        modelBuilder.Entity<User>()
            .HasMany(u => u.Pets)
            .WithMany(p => p.Users);

        // Add ReminderEvent configurations
        modelBuilder.Entity<ReminderEvent>()
            .HasOne(r => r.Pet)
            .WithMany(p => p.FeedingEvents)
            .HasForeignKey(r => r.PetId);

        modelBuilder.Entity<ReminderEvent>()
            .HasOne(r => r.User)
            .WithMany(u => u.FeedingEvents)
            .HasForeignKey(r => r.UserId);

        // Convert enum to string in database (optional, but makes the database more readable)
        modelBuilder.Entity<ReminderEvent>()
            .Property(e => e.EventType)
            .HasConversion<string>();

        // Optional: Add some seed data for testing
        var userId = Guid.NewGuid();  // Pre-generate GUIDs for seeding
        var petId = Guid.NewGuid();
        var reminderEventId = Guid.NewGuid();

        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = userId,
                Email = "test@example.com",
                Name = "Test User",
                PasswordHash = "test123"
            }
        );

        modelBuilder.Entity<Pet>().HasData(
            new Pet
            {
                Id = petId,
                Name = "TestPet",
                CreatedAt = DateTime.UtcNow
            }
        );

        modelBuilder.Entity<ReminderEvent>().HasData(
            new ReminderEvent
            {
                Id = reminderEventId,
                EventType = ReminderEventType.Feeding,
                EventTIme = DateTime.UtcNow,
                UserId = userId,
                PetId = petId
            }
        );
    }
}