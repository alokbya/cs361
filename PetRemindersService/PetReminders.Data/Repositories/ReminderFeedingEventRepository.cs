using Microsoft.EntityFrameworkCore;
using PetReminders.Core.Models;

public class ReminderEventRepository : IReminderEventRepository
{
    private readonly PetReminderContext _context;

    public ReminderEventRepository(PetReminderContext context)
    {
        _context = context;
    }

    public async Task<ReminderEvent?> GetByIdAsync(Guid id)
    {
        return await _context.ReminderEvents
            .Include(r => r.User)
            .Include(r => r.Pet)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<List<ReminderEvent>> GetAllAsync()
    {
        return await _context.ReminderEvents
            .Include(r => r.User)
            .Include(r => r.Pet)
            .ToListAsync();
    }

    public async Task<List<ReminderEvent>> GetByPetIdAsync(Guid petId)
    {
        return await _context.ReminderEvents
            .Include(r => r.User)
            .Include(r => r.Pet)
            .Where(r => r.PetId == petId)
            .OrderByDescending(r => r.EventTIme)
            .ToListAsync();
    }

    public async Task<List<ReminderEvent>> GetByUserIdAsync(Guid userId)
    {
        return await _context.ReminderEvents
            .Include(r => r.User)
            .Include(r => r.Pet)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.EventTIme)
            .ToListAsync();
    }

    public async Task<List<ReminderEvent>> GetRecentByPetIdAsync(Guid petId, int count = 10)
    {
        return await _context.ReminderEvents
            .Include(r => r.User)
            .Include(r => r.Pet)
            .Where(r => r.PetId == petId)
            .OrderByDescending(r => r.EventTIme)
            .Take(count)
            .ToListAsync();
    }

    public async Task<ReminderEvent> AddAsync(ReminderEvent reminderEvent)
    {
        _context.ReminderEvents.Add(reminderEvent);
        await _context.SaveChangesAsync();
        return reminderEvent;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var reminderEvent = await _context.ReminderEvents.FindAsync(id);
        if (reminderEvent == null) return false;

        _context.ReminderEvents.Remove(reminderEvent);
        await _context.SaveChangesAsync();
        return true;
    }
}