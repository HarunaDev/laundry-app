using LaundryApp.Helpers;

namespace LaundryApp.Models;

public enum UserRole { Client, Admin, SuperAdmin }

public enum UserStatus
{
    Active,
    Inactive
}

public class User
{
    public string Id { get; set; } = IdGenerator.GenerateId();
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public bool EmailVerified { get; set; }
    public UserRole Role { get; set; } = UserRole.Client;
    public string PhoneNumber { get; set; } = "";
    // public int TotalOrders { get; set; } = 0;
    public UserStatus Status { get; set; } = UserStatus.Active;
    public bool IsDeleted { get; set; } = false;

    public DateTime? DeletedAt { get; set; }

    public string? DeletedBy { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public string? UpdatedBy { get; set; }

    public ICollection<RefreshToken>
        RefreshTokens
    { get; set; }
        = new List<RefreshToken>();

    public ICollection<LaundryOrder> LaundryOrders
    {
        get; set;
    } = new List<LaundryOrder>();
}