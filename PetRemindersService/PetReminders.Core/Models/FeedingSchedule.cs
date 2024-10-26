using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetReminders.Core.Models;
public class FeedingSchedule
{
    public int Id { get; set; }
    public TimeSpan FeedingTime { get; set; }
    // Additional fields later: Recurrence, FoodType
}
