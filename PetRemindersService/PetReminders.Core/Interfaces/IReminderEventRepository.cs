using PetReminders.Core.Models;

public interface IReminderEventRepository
{
    Task<ReminderEvent?> GetByIdAsync(Guid id);
    Task<List<ReminderEvent>> GetAllAsync();
    Task<List<ReminderEvent>> GetByPetIdAsync(Guid petId);
    Task<List<ReminderEvent>> GetByUserIdAsync(Guid userId);
    Task<List<ReminderEvent>> GetRecentByPetIdAsync(Guid petId, int count = 10);
    Task<ReminderEvent> AddAsync(ReminderEvent reminderEvent);
    Task<bool> DeleteAsync(Guid id);
}