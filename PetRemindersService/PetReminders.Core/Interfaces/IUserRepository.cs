using PetReminders.Core.Models;

namespace PetReminders.Core.Interfaces;
public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id);
    Task<User?> GetByEmailAsync(string email);
    Task<List<User>> GetAllAsync();
    Task<User> CreateAsync(User user);
    Task<User?> UpdateAsync(Guid id, User user);
    Task<bool> DeleteAsync(Guid id);
}