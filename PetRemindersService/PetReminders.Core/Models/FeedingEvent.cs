using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetReminders.Core.Models;
public class FeedingEvent
{
    public int Id { get; set; }
    public DateTime FeedingTime { get; set; } = DateTime.UtcNow;

    // Foreign keys
    public required int UserId { get; set; }
    public required int PetId { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Pet Pet { get; set; } = null!;
}