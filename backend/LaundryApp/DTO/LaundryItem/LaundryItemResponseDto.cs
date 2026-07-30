namespace LaundryApp.DTO.LaundryItem;

public class LaundryItemResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = "";

    public decimal Price { get; set; }

    public int LaundryServiceId { get; set; }

    public string LaundryServiceName { get; set; } = "";
}