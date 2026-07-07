using LaundryApp.Helpers;

namespace LaundryApp.Models;

public class RefreshToken
{
    public string Id { get; set; } = IdGenerator.GenerateId();

    public string Token { get; set; } = "";

    public DateTime ExpiresAt { get; set; }

    public bool IsRevoked { get; set; }

    public string UserId { get; set; } = "";

    public User User { get; set; } = null!;
}