
namespace LaundryApp.DTO.Payment;

public class PaymentReceiptResponseDto
{
    public int Id { get; set; }

    public int PaymentId { get; set; }

    public string FileName { get; set; } = string.Empty;

    public string ContentType { get; set; } = string.Empty;

    public long FileSize { get; set; }

    public DateTime UploadedAt { get; set; }

    public bool IsCurrent { get; set; }

    public bool IsRejected { get; set; }

    public string? RejectedBy { get; set; }

    public DateTime? RejectedAt { get; set; }

    public string? RejectionReason { get; set; }

    public DateTime? FileDeletedAt { get; set; }

    public bool IsFileAvailable { get; set; }
}
