using Microsoft.EntityFrameworkCore;
using PetReminders.Core.Interfaces;
using PetReminders.Core.Models;

namespace PetReminders.Data.Repositories;

public class UserRepository : IUserRepository
{
    private readonly PetReminderContext _context;

    public UserRepository(PetReminderContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        return await _context.Users
            .Include(u => u.Pets)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .Include(u => u.Pets)
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _context.Users
            .Include(u => u.Pets)
            .ToListAsync();
    }

    public async Task<User> CreateAsync(User user)
    {
        // In a real application, you'd want to hash the password here
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User?> UpdateAsync(Guid id, User updatedUser)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return null;

        user.Name = updatedUser.Name;
        user.Email = updatedUser.Email;
        // Be careful with password updates in a real application
        user.PasswordHash = updatedUser.PasswordHash;

        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }
}