
using LaundryApp.Data;
using Microsoft.EntityFrameworkCore;

namespace LaundryApp.Services;

public class PaymentReceiptCleanupService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<PaymentReceiptCleanupService> _logger;

    private static readonly TimeSpan RetentionPeriod =
        TimeSpan.FromDays(60);

    private static readonly TimeSpan CleanupInterval =
        TimeSpan.FromHours(24);

    public PaymentReceiptCleanupService(
        IServiceScopeFactory scopeFactory,
        ILogger<PaymentReceiptCleanupService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        // Run once at startup, then every 24 hours.
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await CleanupRejectedReceiptsAsync(stoppingToken);
            }
            catch (Exception exception)
            {
                _logger.LogError(
                    exception,
                    "An error occurred during receipt cleanup.");
            }

            await Task.Delay(CleanupInterval, stoppingToken);
        }
    }

    private async Task CleanupRejectedReceiptsAsync(
        CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();

        var context = scope.ServiceProvider
            .GetRequiredService<LaundryAppDbContext>();

        var environment = scope.ServiceProvider
            .GetRequiredService<IWebHostEnvironment>();

        var cutoffDate = DateTime.UtcNow - RetentionPeriod;

        var receipts = await context.PaymentReceipts
            .Where(r =>
                r.IsRejected &&
                !r.IsCurrent &&
                r.RejectedAt != null &&
                r.RejectedAt <= cutoffDate &&
                r.FileDeletedAt == null)
            .ToListAsync(cancellationToken);

        var uploadDirectory = Path.Combine(
            environment.ContentRootPath,
            "App_Data",
            "PaymentReceipts");

        foreach (var receipt in receipts)
        {
            try
            {
                var fileName = Path.GetFileName(receipt.FilePath);

                var filePath = Path.Combine(
                    uploadDirectory,
                    fileName);

                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }

                // Retain the database record for audit purposes.
                receipt.FileDeletedAt = DateTime.UtcNow;

                _logger.LogInformation(
                    "Deleted expired receipt {ReceiptId} for payment {PaymentId}.",
                    receipt.Id,
                    receipt.PaymentId);
            }
            catch (Exception exception)
            {
                _logger.LogError(
                    exception,
                    "Failed to delete receipt {ReceiptId}.",
                    receipt.Id);
            }
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}
