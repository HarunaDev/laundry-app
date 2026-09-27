using Microsoft.EntityFrameworkCore;
using LaundryApp.Data;
using LaundryApp.DTO.Dashboard;
using LaundryApp.Models;

namespace LaundryApp.Services;

public class DashboardMetricsService
{
    private readonly LaundryAppDbContext _context;

    public DashboardMetricsService(LaundryAppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardMetricsDto> GetMetricsAsync(
        string period = "week")
    {
        var now = DateTime.UtcNow;

        var (currentStart, currentEnd, previousStart, previousEnd) =
            GetPeriodRange(period, now);

        var ordersQuery = _context.LaundryOrders
            .AsNoTracking()
            .Where(order => !order.IsDeleted);

        var usersQuery = _context.Users
            .AsNoTracking()
            .Where(user =>
                !user.IsDeleted &&
                user.Role == UserRole.Client);

        // ============================
        // CURRENT PERIOD SUMMARY
        // ============================

        var currentOrdersQuery = ordersQuery
            .Where(order =>
                order.CreatedAt >= currentStart &&
                order.CreatedAt < currentEnd);

        var totalOrders = await currentOrdersQuery.CountAsync();

        var completedOrders = await currentOrdersQuery
            .CountAsync(order => order.Status == OrderStatus.Completed);

        var totalRevenue = await currentOrdersQuery
            .Where(order => order.Status == OrderStatus.Completed)
            .SumAsync(order => (decimal?)order.GrandTotal) ?? 0m;

        var newCustomers = await usersQuery
            .Where(user =>
                user.CreatedAt >= currentStart &&
                user.CreatedAt < currentEnd)
            .CountAsync();

        // ============================
        // PREVIOUS PERIOD SUMMARY
        // ============================

        var previousOrdersQuery = ordersQuery
            .Where(order =>
                order.CreatedAt >= previousStart &&
                order.CreatedAt < previousEnd);

        var previousTotalOrders = await previousOrdersQuery
            .CountAsync();

        var previousCompletedOrders = await previousOrdersQuery
            .CountAsync(order => order.Status == OrderStatus.Completed);

        var previousRevenue = await previousOrdersQuery
            .Where(order => order.Status == OrderStatus.Completed)
            .SumAsync(order => (decimal?)order.GrandTotal) ?? 0m;

        var previousNewCustomers = await usersQuery
            .Where(user =>
                user.CreatedAt >= previousStart &&
                user.CreatedAt < previousEnd)
            .CountAsync();

        // ============================
        // ORDERS OVERVIEW
        // ============================

        var ordersOverview = await currentOrdersQuery
            .GroupBy(order => order.CreatedAt.Date)
            .Select(group => new OrderMetricPointDto
            {
                Date = group.Key,
                OrderCount = group.Count()
            })
            .OrderBy(point => point.Date)
            .ToListAsync();

        // ============================
        // REVENUE OVERVIEW
        // ============================

        var revenueOverview = await currentOrdersQuery
            .Where(order => order.Status == OrderStatus.Completed)
            .GroupBy(order => order.CreatedAt.Date)
            .Select(group => new RevenueMetricPointDto
            {
                Date = group.Key,
                Revenue = group.Sum(order => order.GrandTotal)
            })
            .OrderBy(point => point.Date)
            .ToListAsync();

        // ============================
        // RECENT ORDERS
        // ============================

        var recentOrders = await ordersQuery
            .Include(order => order.User)
            .OrderByDescending(order => order.CreatedAt)
            .Take(5)
            .Select(order => new RecentOrderMetricDto
            {
                OrderId = order.Id,
                CustomerName = order.User.UserName,
                CreatedAt = order.CreatedAt,
                Status = order.Status,
                GrandTotal = order.GrandTotal
            })
            .ToListAsync();

        // ============================
        // RESPONSE
        // ============================

        return new DashboardMetricsDto
        {
            Summary = new DashboardSummaryDto
            {
                TotalOrders = totalOrders,

                CompletedOrders = completedOrders,

                TotalRevenue = totalRevenue,

                NewCustomers = newCustomers,

                OrdersChangePercentage = CalculatePercentageChange(
                    previousTotalOrders,
                    totalOrders),

                CompletedOrdersChangePercentage = CalculatePercentageChange(
                    previousCompletedOrders,
                    completedOrders),

                RevenueChangePercentage = CalculatePercentageChange(
                    previousRevenue,
                    totalRevenue),

                NewCustomersChangePercentage = CalculatePercentageChange(
                    previousNewCustomers,
                    newCustomers)
            },

            OrdersOverview = ordersOverview,

            RecentOrders = recentOrders,

            RevenueOverview = revenueOverview
        };
    }

    private static decimal CalculatePercentageChange(
        decimal previousValue,
        decimal currentValue)
    {
        if (previousValue == 0)
        {
            return currentValue == 0
                ? 0
                : 100;
        }

        return Math.Round(
            ((currentValue - previousValue) / previousValue) * 100,
            2);
    }

    private static (
        DateTime currentStart,
        DateTime currentEnd,
        DateTime previousStart,
        DateTime previousEnd
    ) GetPeriodRange(
        string period,
        DateTime now)
    {
        var normalizedPeriod = period.Trim().ToLowerInvariant();

        return normalizedPeriod switch
        {
            "week" => GetWeekRange(now),

            "month" => GetMonthRange(now),

            "year" => GetYearRange(now),

            _ => throw new ArgumentException(
                "Invalid period. Supported values are: week, month, year.")
        };
    }

    private static (
        DateTime currentStart,
        DateTime currentEnd,
        DateTime previousStart,
        DateTime previousEnd
    ) GetWeekRange(DateTime now)
    {
        var today = now.Date;

        var daysSinceMonday =
            ((int)today.DayOfWeek + 6) % 7;

        var currentStart = today.AddDays(-daysSinceMonday);

        var currentEnd = now;

        var currentDuration =
            currentEnd - currentStart;

        var previousEnd = currentStart;

        var previousStart =
            previousEnd - currentDuration;

        return (
            currentStart,
            currentEnd,
            previousStart,
            previousEnd
        );
    }

    private static (
        DateTime currentStart,
        DateTime currentEnd,
        DateTime previousStart,
        DateTime previousEnd
    ) GetMonthRange(DateTime now)
    {
        var currentStart = new DateTime(
            now.Year,
            now.Month,
            1,
            0,
            0,
            0,
            DateTimeKind.Utc);

        var currentEnd = now;

        var previousEnd = currentStart;

        var previousStart = previousEnd.AddMonths(-1);

        return (
            currentStart,
            currentEnd,
            previousStart,
            previousEnd
        );
    }

    private static (
        DateTime currentStart,
        DateTime currentEnd,
        DateTime previousStart,
        DateTime previousEnd
    ) GetYearRange(DateTime now)
    {
        var currentStart = new DateTime(
            now.Year,
            1,
            1,
            0,
            0,
            0,
            DateTimeKind.Utc);

        var currentEnd = now;

        var previousEnd = currentStart;

        var previousStart = previousEnd.AddYears(-1);

        return (
            currentStart,
            currentEnd,
            previousStart,
            previousEnd
        );
    }
}