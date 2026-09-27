using LaundryApp.Models;

namespace LaundryApp.DTO.Dashboard;

public class RecentOrderMetricDto
{
    public int OrderId { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public OrderStatus Status { get; set; }

    public decimal GrandTotal { get; set; }
}