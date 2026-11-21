
namespace LaundryApp.Models;

public class PaymentReceipt
{
    public int Id { get; set; }

    public int PaymentId { get; set; }
    public Payment Payment { get; set; } = null!;

    public string FilePath { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long FileSize { get; set; }

    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    // Only one receipt should be current per payment.
    public bool IsCurrent { get; set; }

    // Rejection information for this particular submission.
    public bool IsRejected { get; set; }
    public string? RejectedBy { get; set; }
    public DateTime? RejectedAt { get; set; }
    public string? RejectionReason { get; set; }

    // Null means the physical file is still retained.
    // A timestamp means the file has been deleted.
    public DateTime? FileDeletedAt { get; set; }
}
