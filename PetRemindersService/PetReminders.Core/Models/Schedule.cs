using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PetReminders.Core.Models;
public class Schedule
{
    public int Id { get; set; }
    public TimeSpan TimeSpan { get; set; }
    // Additional fields later: Recurrence, FoodType
}
