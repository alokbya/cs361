using Microsoft.EntityFrameworkCore;
using PetReminders.Core.Interfaces;
using PetReminders.Core.Models;

namespace PetReminders.Data.Repositories;

public class PetRepository : IPetRepository
{
    private readonly PetReminderContext _context;

    public PetRepository(PetReminderContext context)
    {
        _context = context;
    }

    public async Task<Pet?> GetByIdAsync(Guid id)
    {
        return await _context.Pets
            .Include(p => p.Users)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Pet>> GetAllAsync()
    {
        return await _context.Pets
            .Include(p => p.Users)
            .ToListAsync();
    }

    public async Task<Pet> AddAsync(Pet pet)
    {
        _context.Pets.Add(pet);
        await _context.SaveChangesAsync();
        return pet;
    }

    public async Task<Pet?> UpdateAsync(Pet pet)
    {
        var existingPet = await _context.Pets.FindAsync(pet.Id);
        if (existingPet == null)
            return null;

        // Update properties
        existingPet.Name = pet.Name;
        // Add other properties as needed

        await _context.SaveChangesAsync();
        return existingPet;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var pet = await _context.Pets.FindAsync(id);
        if (pet == null)
            return false;

        _context.Pets.Remove(pet);
        await _context.SaveChangesAsync();
        return true;
    }
}