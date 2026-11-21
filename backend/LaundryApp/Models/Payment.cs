
namespace LaundryApp.Models;

public class Payment
{
    public int Id { get; set; }

    public int LaundryOrderId { get; set; }
    public LaundryOrder LaundryOrder { get; set; } = null!;

    public PaymentMethod PaymentMethod { get; set; }

    public PaymentStatus PaymentStatus { get; set; }
        = PaymentStatus.Pending;

    // Uploaded receipt information
    public string? ReceiptPath { get; set; }
    public string? ReceiptFileName { get; set; }
    public string? ReceiptContentType { get; set; }
    public long? ReceiptFileSize { get; set; }
    public DateTime? ReceiptUploadedAt { get; set; }

    // Payment confirmation audit
    public string? ConfirmedBy { get; set; }
    public DateTime? ConfirmedAt { get; set; }

    // Rejection audit
    public string? RejectedBy { get; set; }
    public DateTime? RejectedAt { get; set; }
    public string? RejectionReason { get; set; }

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public ICollection<PaymentReceipt> Receipts { get; set; }
    = new List<PaymentReceipt>();
}
