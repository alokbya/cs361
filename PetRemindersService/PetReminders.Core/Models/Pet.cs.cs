using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetReminders.Core.Models;
public class Pet
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public List<User> Users { get; set; } = new(); // Allows multiple family members
    public List<FeedingEvent> FeedingEvents { get; set; } = new();
    public List<FeedingSchedule> FeedingSchedules { get; set; } = new();
}