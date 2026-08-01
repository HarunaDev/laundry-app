using LaundryApp.Helpers;

namespace LaundryApp.Models;

public class LaundryLocation
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public required string Address { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public string? Landmark { get; set; }

    public string? PhoneNumber { get; set; }

    public bool IsActive { get; set; } = true;

    public bool IsDeleted { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }

    public string? DeletedBy { get; set; }
}