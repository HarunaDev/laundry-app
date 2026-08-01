using System.ComponentModel.DataAnnotations;

namespace LaundryApp.DTO.DeliveryMethod;

public class DeliveryMethodDto
{
    public int Id { get; set; }

    public string Name { get; set; } = "";

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public bool IsActive { get; set; }
}

public class DeliveryMethodResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = "";

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public bool IsActive { get; set; }
}

public class CreateDeliveryMethodDto
{
    [Required]
    public string Name { get; set; } = "";

    public string? Description { get; set; }

    public decimal Price { get; set; } = 0;
}

public class UpdateDeliveryMethodDto
{
    [Required]
    public string Name { get; set; } = "";

    public string? Description { get; set; }

    public decimal Price { get; set; }

    public bool IsActive { get; set; }
}