namespace LaundryApp.DTO.Dashboard;

public class DashboardMetricsDto
{
    public DashboardSummaryDto Summary { get; set; } = new();

    public List<OrderMetricPointDto> OrdersOverview { get; set; } = [];

    public List<RecentOrderMetricDto> RecentOrders { get; set; } = [];

    public List<RevenueMetricPointDto> RevenueOverview { get; set; } = [];
}