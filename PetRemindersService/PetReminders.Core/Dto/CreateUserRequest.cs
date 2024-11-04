// In CreateUserRequest.cs
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