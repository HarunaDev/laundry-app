using LaundryApp.Models;

namespace LaundryApp.Models;

public enum OrderStatus
{
    Pending = 1,
    InProgress = 2,
    Completed = 3
}

public class LaundryOrder
{
    public int Id { get; set; }

    // Customer
    public required string UserId { get; set; }
    public User User { get; set; } = null!;

    // Delivery
    public int DeliveryMethodId { get; set; }
    public DeliveryMethod DeliveryMethod { get; set; } = null!;

    public int? LaundryLocationId { get; set; }
    public LaundryLocation? LaundryLocation { get; set; }

    public string? PickupAddress { get; set; }

    public string? DeliveryAddress { get; set; }

    // Pricing
    public decimal DeliveryPrice { get; set; }

    public decimal ItemsTotal { get; set; }

    public decimal GrandTotal { get; set; }

    // Status

    public OrderStatus Status { get; set; }
        = OrderStatus.Pending;

    // Audit

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public DateTime? ConfirmedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public string? ConfirmedBy { get; set; }

    // Soft Delete

    public bool IsDeleted { get; set; }

    public DateTime? DeletedAt { get; set; }

    public string? DeletedBy { get; set; }

    // Navigation

    public ICollection<OrderItem> OrderItems { get; set; }
        = new List<OrderItem>();
}