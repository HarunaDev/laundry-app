namespace LaundryApp.Models.Dashboard;

public class DashboardMetrics
{
    public DashboardSummary Summary { get; set; } = new();

    public List<OrderMetricPoint> OrdersOverview { get; set; } = [];

    public List<RecentOrderMetric> RecentOrders { get; set; } = [];

    public List<RevenueMetricPoint> RevenueOverview { get; set; } = [];
}

public class DashboardSummary
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

public class OrderMetricPoint
{
    public DateTime Date { get; set; }

    public int OrderCount { get; set; }
}

public class RevenueMetricPoint
{
    public DateTime Date { get; set; }

    public decimal Revenue { get; set; }
}

public class RecentOrderMetric
{
    public int OrderId { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public OrderStatus Status { get; set; }

    public decimal GrandTotal { get; set; }
}