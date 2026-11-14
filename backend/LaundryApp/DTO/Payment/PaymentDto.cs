
using System.ComponentModel.DataAnnotations;
using LaundryApp.Models;

namespace LaundryApp.DTO.Payment;

public class ConfirmPaymentDto
{
    // Optional administrative note
    public string? Notes { get; set; }
}

public class RejectPaymentDto
{
    [Required]
    [MinLength(3)]
    [MaxLength(500)]
    public string Reason { get; set; } = string.Empty;
}

public class PaymentResponseDto
{
    public int Id { get; set; }

    public int LaundryOrderId { get; set; }

    public decimal Amount { get; set; }

    public PaymentMethod PaymentMethod { get; set; }

    public PaymentStatus PaymentStatus { get; set; }

    // Receipt information
    public string? ReceiptFileName { get; set; }

    public string? ReceiptContentType { get; set; }

    public long? ReceiptFileSize { get; set; }

    public DateTime? ReceiptUploadedAt { get; set; }

    // Payment confirmation
    public DateTime? ConfirmedAt { get; set; }

    public string? ConfirmedBy { get; set; }

    // Payment rejection
    public string? RejectionReason { get; set; }

    public string? RejectedBy { get; set; }

    public DateTime? RejectedAt { get; set; }

    public DateTime CreatedAt { get; set; }
}
