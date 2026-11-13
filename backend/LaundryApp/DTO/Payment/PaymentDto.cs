
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

public class CreateBankAccountDto
{
    [Required]
    [MaxLength(100)]
    public string BankName { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string AccountName { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^\d{10}$",
        ErrorMessage = "Account number must contain exactly 10 digits.")]
    public string AccountNumber { get; set; } = string.Empty;
}

public class UpdateBankAccountDto
{
    [Required]
    [MaxLength(100)]
    public string BankName { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string AccountName { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^\d{10}$",
        ErrorMessage = "Account number must contain exactly 10 digits.")]
    public string AccountNumber { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}

public class PaymentResponseDto
{
    public int Id { get; set; }

    public int LaundryOrderId { get; set; }

    public PaymentMethod PaymentMethod { get; set; }

    public PaymentStatus PaymentStatus { get; set; }

    public string? ReceiptFileName { get; set; }

    public string? ReceiptContentType { get; set; }

    public DateTime? ReceiptUploadedAt { get; set; }

    public DateTime? ConfirmedAt { get; set; }

    public string? ConfirmedBy { get; set; }

    public DateTime CreatedAt { get; set; }
}

public class BankAccountResponseDto
{
    public int Id { get; set; }

    public string BankName { get; set; } = string.Empty;

    public string AccountName { get; set; } = string.Empty;

    public string AccountNumber { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}
