// src/PetReminders.Core/Services/PasswordService.cs
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace PetReminders.Core.Services;

public interface IPasswordService
{
    string HashPassword(string password);
    bool VerifyPassword(string hashedPassword, string providedPassword);
}

public class PasswordService : IPasswordService
{
    private const int SaltSize = 128 / 8; // 128 bits
    private const int Iterations = 10000;
    private const KeyDerivationPrf Prf = KeyDerivationPrf.HMACSHA256;
    private const int HashSize = 256 / 8; // 256 bits

    public string HashPassword(string password)
    {
        // Generate a random salt
        byte[] salt = new byte[SaltSize];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }

        // Hash the password with PBKDF2
        byte[] hash = KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: Prf,
            iterationCount: Iterations,
            numBytesRequested: HashSize
        );

        // Combine salt and hash
        byte[] combined = new byte[SaltSize + HashSize];
        Buffer.BlockCopy(salt, 0, combined, 0, SaltSize);
        Buffer.BlockCopy(hash, 0, combined, SaltSize, HashSize);

        // Convert to base64 for storage
        return Convert.ToBase64String(combined);
    }

    public bool VerifyPassword(string hashedPassword, string providedPassword)
    {
        try
        {
            // Convert from base64
            byte[] combined = Convert.FromBase64String(hashedPassword);

            // Extract salt and hash
            byte[] salt = new byte[SaltSize];
            byte[] hash = new byte[HashSize];
            Buffer.BlockCopy(combined, 0, salt, 0, SaltSize);
            Buffer.BlockCopy(combined, SaltSize, hash, 0, HashSize);

            // Hash the provided password with the same salt
            byte[] newHash = KeyDerivation.Pbkdf2(
                password: providedPassword,
                salt: salt,
                prf: Prf,
                iterationCount: Iterations,
                numBytesRequested: HashSize
            );

            // Compare the hashes
            return CryptographicOperations.FixedTimeEquals(hash, newHash);
        }
        catch
        {
            return false;
        }
    }
}