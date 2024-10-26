using Microsoft.EntityFrameworkCore;
using PetReminders.Core.Models;

namespace PetReminders.Data;

public class PetReminderContext : DbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Pet> Pets => Set<Pet>();
    public DbSet<FeedingEvent> FeedingEvents => Set<FeedingEvent>();
    public DbSet<FeedingSchedule> FeedingSchedules => Set<FeedingSchedule>();

    public PetReminderContext(DbContextOptions<PetReminderContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure many-to-many relationship between Users and Pets
        modelBuilder.Entity<User>()
            .HasMany(u => u.Pets)
            .WithMany(p => p.Users);

        // Configure indexes
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<FeedingEvent>()
            .HasIndex(f => f.FeedingTime);
    }
}