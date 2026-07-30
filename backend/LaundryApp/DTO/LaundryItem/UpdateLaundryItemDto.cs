using System.ComponentModel.DataAnnotations;

namespace LaundryApp.DTO.LaundryItem;

public class UpdateLaundryItemDto
{
    [Required]
    public string Name { get; set; } = "";

    [Required]
    public decimal Price { get; set; }

    [Required]
    public int LaundryServiceId { get; set; }
}