using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LaundryApp.DTO.Dashboard;
using LaundryApp.Services;

namespace LaundryApp.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize(Roles = "Admin,SuperAdmin")]
public class DashboardController : ControllerBase
{
    private readonly DashboardMetricsService _dashboardMetricsService;

    public DashboardController(
        DashboardMetricsService dashboardMetricsService)
    {
        _dashboardMetricsService = dashboardMetricsService;
    }

    [HttpGet("metrics")]
    public async Task<IActionResult> GetMetrics(
        [FromQuery] string period = "week")
    {
        try
        {
            var metrics =
                await _dashboardMetricsService.GetMetricsAsync(period);

            return Ok(new
            {
                success = true,
                message = "Dashboard metrics retrieved successfully.",
                data = metrics
            });
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                success = false,
                message = exception.Message
            });
        }
    }
}