namespace LaundryApp.DTO.Dashboard;

public class DashboardSummaryDto
{
    public int TotalOrders { get; set; }

    public int CompletedOrders { get; set; }

    public decimal TotalRevenue { get; set; }

    public int NewCustomers { get; set; }

    public decimal OrdersChangePercentage { get; set; }

    public decimal CompletedOrdersChangePercentage { get; set; }

    public decimal RevenueChangePercentage { get; set; }

    public decimal NewCustomersChangePercentage { get; set; }
}