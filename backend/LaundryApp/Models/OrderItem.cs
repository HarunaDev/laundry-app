namespace LaundryApp.Models;

public class OrderItem
{
    public int Id { get; set; }

    public int LaundryOrderId { get; set; }
    public LaundryOrder LaundryOrder { get; set; } = null!;

    public int LaundryItemId { get; set; }
    public LaundryItem LaundryItem { get; set; } = null!;

    // Snapshot values
    // (kept even if prices change later)

    public string LaundryItemName { get; set; } = "";

    public string LaundryServiceName { get; set; } = "";

    public decimal UnitPrice { get; set; }

    public int Quantity { get; set; }

    public decimal TotalPrice { get; set; }
}