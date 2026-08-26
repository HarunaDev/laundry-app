using System.ComponentModel.DataAnnotations;

namespace LaundryApp.DTO.LaundryOrder;

public class CreateLaundryOrderDto
{
    // Only supplied when Admin creates the order
    public string? UserId { get; set; }

    [Required]
    public int DeliveryMethodId { get; set; }

    public int? LaundryLocationId { get; set; }

    public string? PickupAddress { get; set; }
    public string? DeliveryAddress { get; set; }

    [Required]
    [MinLength(1)]
    public List<CreateOrderItemDto> Items { get; set; }
        = new();
}

public class CreateOrderItemDto
{
    [Required]
    public int LaundryItemId { get; set; }

    [Range(1, 100)]
    public int Quantity { get; set; }
}

public class ConfirmLaundryOrderDto
{
    [Required]
    public int DeliveryMethodId { get; set; }

    public int? LaundryLocationId { get; set; }

    public string? PickupAddress { get; set; }
    public string? DeliveryAddress { get; set; }

    [Required]
    public List<CreateOrderItemDto> Items { get; set; }
        = new();
}

public class LaundryOrderDto
{
    public int Id { get; set; }

    public string CustomerId { get; set; } = "";

    public string CustomerName { get; set; } = "";

    public string DeliveryMethod { get; set; } = "";

    public string? LaundryLocation { get; set; }

    public string? PickupAddress { get; set; }
    public string? DeliveryAddress { get; set; }

    public decimal DeliveryPrice { get; set; }

    public decimal ItemsTotal { get; set; }

    public decimal GrandTotal { get; set; }

    public string Status { get; set; } = "";

    public DateTime CreatedAt { get; set; }
}

public class LaundryOrderResponseDto
{
    public int Id { get; set; }

    public string CustomerId { get; set; } = "";

    public string CustomerName { get; set; } = "";

    public string DeliveryMethod { get; set; } = "";

    public string? LaundryLocation { get; set; }

    public string? DeliveryAddress { get; set; }
    public string? PickupAddress { get; set; }

    public decimal DeliveryPrice { get; set; }

    public decimal ItemsTotal { get; set; }

    public decimal GrandTotal { get; set; }

    public string Status { get; set; } = "";

    public DateTime CreatedAt { get; set; }

    public IEnumerable<OrderItemDto> Items { get; set; }
        = Enumerable.Empty<OrderItemDto>();
}

public class OrderItemDto
{
    public int LaundryItemId { get; set; }

    public string LaundryItemName { get; set; } = "";

    public string LaundryServiceName { get; set; } = "";

    public decimal UnitPrice { get; set; }

    public int Quantity { get; set; }

    public decimal TotalPrice { get; set; }
}

public class GetLaundryOrdersDto
{
    public string? Status { get; set; } = "All";

    public int PageNumber { get; set; } = 1;

    public int PageSize { get; set; } = 10;
}