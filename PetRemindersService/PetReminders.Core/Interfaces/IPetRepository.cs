using PetReminders.Core.Models;

namespace PetReminders.Core.Interfaces;
public interface IPetRepository
{
    Task<Pet?> GetByIdAsync(Guid id);
    Task<List<Pet>> GetAllAsync();
    Task<Pet> AddAsync(Pet pet);
    Task<Pet?> UpdateAsync(Pet pet);  // Returns null if pet not found
    Task<bool> DeleteAsync(Guid id);
}