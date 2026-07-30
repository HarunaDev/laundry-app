using System.ComponentModel.DataAnnotations;

namespace LaundryApp.DTO.LaundryItem;


public class CreateLaundryItemDto
{
    [Required]
    public string Name { get; set; } = "";

    [Required]
    public decimal Price { get; set; }

    [Required]
    public int LaundryServiceId { get; set; }
}
