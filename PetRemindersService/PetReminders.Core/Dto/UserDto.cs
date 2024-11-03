namespace PetReminders.Core.Dto;

public record CreateUserRequest(
    string Email,
    string Name,
    string Password
)
{
    public bool IsValidEmail()
    {
        try
        {
            var addr = new System.Net.Mail.MailAddress(Email);
            return addr.Address == Email;
        }
        catch
        {
            return false;
        }
    }
}

public record UpdateUserRequest(
    string Email,
    string Name,
    string? Password
);

public record UserResponse(
    Guid Id,
    string Email,
    string Name,
    DateTime CreatedAt,
    DateTime? LastLoginAt,
    IEnumerable<string> PetNames
);