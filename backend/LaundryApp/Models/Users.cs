using LaundryApp.Helpers;

namespace LaundryApp.Models;

public enum UserRole { Client, Admin, SuperAdmin }

public class User
{
    public string Id { get; set; } = IdGenerator.GenerateId();
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public bool EmailVerified { get; set; }
    public UserRole Role { get; set; } = UserRole.Client;

    public bool IsDeleted { get; set; } = false;

    public DateTime? DeletedAt { get; set; }

    public string? DeletedBy { get; set; }
    
    public ICollection<RefreshToken>
        RefreshTokens
    { get; set; }
        = new List<RefreshToken>();
}