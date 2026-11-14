
using System.Security.Claims;
using LaundryApp.Data;
using LaundryApp.DTO.Payment;
using LaundryApp.Exceptions;
using LaundryApp.Models;
using Microsoft.EntityFrameworkCore;

namespace LaundryApp.Services;

public class PaymentService
{
    private readonly LaundryAppDbContext _context;
    private readonly IWebHostEnvironment _environment;

    private const long MaxReceiptSize = 5 * 1024 * 1024;

    private static readonly Dictionary<string, string> AllowedContentTypes =
        new()
        {
            ["application/pdf"] = ".pdf",
            ["image/jpeg"] = ".jpg",
            ["image/png"] = ".png"
        };

    public PaymentService(
        LaundryAppDbContext context,
        IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    // ==========================================================
    // GET PAYMENT BY ORDER ID
    // ==========================================================

    public async Task<PaymentResponseDto> GetByOrderIdAsync(
        int orderId,
        ClaimsPrincipal currentUser)
    {
        var payment = await GetPaymentAsync(orderId);

        EnsureOrderAccess(payment, currentUser);

        return MapToResponse(payment);
    }

    // ==========================================================
    // UPLOAD PAYMENT RECEIPT
    //
    // CLIENT ONLY
    // ==========================================================

    public async Task<PaymentResponseDto> UploadReceiptAsync(
        int orderId,
        IFormFile file,
        ClaimsPrincipal currentUser)
    {
        var userId = GetCurrentUserId(currentUser);

        var payment = await GetPaymentAsync(orderId);

        EnsureOrderOwnership(payment, userId);

        if (payment.PaymentMethod != PaymentMethod.Transfer)
        {
            throw new BadRequestException(
                "Receipt uploads are only allowed for bank transfers.");
        }

        if (payment.PaymentStatus == PaymentStatus.Paid)
        {
            throw new BadRequestException(
                "Payment has already been confirmed.");
        }

        ValidateReceipt(file);

        var extension = AllowedContentTypes[file.ContentType];

        var fileName = $"{Guid.NewGuid():N}{extension}";

        var uploadDirectory = Path.Combine(
            _environment.ContentRootPath,
            "App_Data",
            "PaymentReceipts");

        Directory.CreateDirectory(uploadDirectory);

        var filePath = Path.Combine(
            uploadDirectory,
            fileName);

        await using (var stream = new FileStream(
            filePath,
            FileMode.CreateNew,
            FileAccess.Write,
            FileShare.None,
            81920,
            useAsync: true))
        {
            await file.CopyToAsync(stream);
        }

        // Remove the previous receipt after the new one
        // has been successfully saved.

        var previousReceipt = payment.ReceiptPath;

        payment.ReceiptPath = fileName;
        payment.ReceiptFileName = Path.GetFileName(file.FileName);
        payment.ReceiptContentType = file.ContentType;
        payment.ReceiptFileSize = file.Length;
        payment.ReceiptUploadedAt = DateTime.UtcNow;

        // A rejected payment can be resubmitted.
        payment.PaymentStatus = PaymentStatus.Pending;

        payment.RejectedBy = null;
        payment.RejectedAt = null;
        payment.RejectionReason = null;

        payment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        if (!string.IsNullOrWhiteSpace(previousReceipt))
        {
            var previousPath = Path.Combine(
                uploadDirectory,
                Path.GetFileName(previousReceipt));

            if (File.Exists(previousPath))
            {
                File.Delete(previousPath);
            }
        }

        return MapToResponse(payment);
    }

    // ==========================================================
    // CONFIRM PAYMENT
    //
    // ADMIN / SUPERADMIN ONLY
    // ==========================================================

    public async Task<PaymentResponseDto> ConfirmPaymentAsync(
        int orderId,
        ClaimsPrincipal currentUser)
    {
        var adminId = GetCurrentUserId(currentUser);

        var payment = await GetPaymentAsync(orderId);

        if (payment.PaymentStatus == PaymentStatus.Paid)
        {
            throw new BadRequestException(
                "Payment has already been confirmed.");
        }

        if (payment.PaymentStatus != PaymentStatus.Pending)
        {
            throw new BadRequestException(
                "Only pending payments can be confirmed.");
        }

        if (payment.PaymentMethod == PaymentMethod.Transfer &&
            string.IsNullOrWhiteSpace(payment.ReceiptPath))
        {
            throw new BadRequestException(
                "A payment receipt must be uploaded before confirming a transfer.");
        }

        payment.PaymentStatus = PaymentStatus.Paid;

        payment.ConfirmedBy = adminId;
        payment.ConfirmedAt = DateTime.UtcNow;

        payment.RejectedBy = null;
        payment.RejectedAt = null;
        payment.RejectionReason = null;

        payment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToResponse(payment);
    }

    // ==========================================================
    // REJECT PAYMENT
    //
    // ADMIN / SUPERADMIN ONLY
    // ==========================================================

    public async Task<PaymentResponseDto> RejectPaymentAsync(
        int orderId,
        RejectPaymentDto dto,
        ClaimsPrincipal currentUser)
    {
        var adminId = GetCurrentUserId(currentUser);

        if (string.IsNullOrWhiteSpace(dto.Reason))
        {
            throw new BadRequestException(
                "A rejection reason is required.");
        }

        if (dto.Reason.Length > 500)
        {
            throw new BadRequestException(
                "Rejection reason cannot exceed 500 characters.");
        }

        var payment = await GetPaymentAsync(orderId);

        if (payment.PaymentMethod != PaymentMethod.Transfer)
        {
            throw new BadRequestException(
                "Only transfer payments can be rejected.");
        }

        if (payment.PaymentStatus != PaymentStatus.Pending)
        {
            throw new BadRequestException(
                "Only pending payments can be rejected.");
        }

        if (string.IsNullOrWhiteSpace(payment.ReceiptPath))
        {
            throw new BadRequestException(
                "There is no payment receipt to review.");
        }

        payment.PaymentStatus = PaymentStatus.Rejected;

        payment.RejectedBy = adminId;
        payment.RejectedAt = DateTime.UtcNow;

        payment.RejectionReason = dto.Reason.Trim();

        payment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToResponse(payment);
    }

    // ==========================================================
    // GET RECEIPT FILE
    //
    // ADMIN / SUPERADMIN ONLY
    // ==========================================================

    public async Task<(Stream Stream, string ContentType, string FileName)>
        GetReceiptAsync(int orderId)
    {
        var payment = await GetPaymentAsync(orderId);

        if (string.IsNullOrWhiteSpace(payment.ReceiptPath))
        {
            throw new NotFoundException(
                "Payment receipt not found.");
        }

        var uploadDirectory = Path.Combine(
            _environment.ContentRootPath,
            "App_Data",
            "PaymentReceipts");

        var filePath = Path.Combine(
            uploadDirectory,
            Path.GetFileName(payment.ReceiptPath));

        if (!File.Exists(filePath))
        {
            throw new NotFoundException(
                "Payment receipt file not found.");
        }

        var stream = new FileStream(
            filePath,
            FileMode.Open,
            FileAccess.Read,
            FileShare.Read,
            81920,
            useAsync: true);

        return (
            stream,
            payment.ReceiptContentType ?? "application/octet-stream",
            payment.ReceiptFileName ?? "receipt"
        );
    }

    // ==========================================================
    // PRIVATE HELPERS
    // ==========================================================

    private async Task<Payment> GetPaymentAsync(int orderId)
    {
        var payment = await _context.Payments
            .Include(p => p.LaundryOrder)
            .FirstOrDefaultAsync(p =>
                p.LaundryOrderId == orderId &&
                !p.LaundryOrder.IsDeleted);

        if (payment is null)
        {
            throw new NotFoundException(
                "Payment not found for this order.");
        }

        return payment;
    }

    private static string GetCurrentUserId(
        ClaimsPrincipal currentUser)
    {
        var userId = currentUser.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new UnauthorizedException(
                "Unable to determine the current user.");
        }

        return userId;
    }

    private static void EnsureOrderAccess(
        Payment payment,
        ClaimsPrincipal currentUser)
    {
        var role = currentUser.FindFirstValue(
            ClaimTypes.Role);

        if (role == UserRole.Admin.ToString() ||
            role == UserRole.SuperAdmin.ToString())
        {
            return;
        }

        EnsureOrderOwnership(
            payment,
            GetCurrentUserId(currentUser));
    }

    private static void EnsureOrderOwnership(
        Payment payment,
        string userId)
    {
        if (payment.LaundryOrder.UserId != userId)
        {
            throw new UnauthorizedException(
                "You are not authorized to access this payment.");
        }
    }

    private static void ValidateReceipt(IFormFile file)
    {
        if (file is null || file.Length == 0)
        {
            throw new BadRequestException(
                "Please upload a valid payment receipt.");
        }

        if (file.Length > MaxReceiptSize)
        {
            throw new BadRequestException(
                "Receipt file cannot exceed 5 MB.");
        }

        if (!AllowedContentTypes.ContainsKey(file.ContentType))
        {
            throw new BadRequestException(
                "Invalid receipt format. Allowed formats are PDF, JPG and PNG.");
        }
    }

    private static PaymentResponseDto MapToResponse(
        Payment payment)
    {
        return new PaymentResponseDto
        {
            Id = payment.Id,

            LaundryOrderId = payment.LaundryOrderId,

            Amount = payment.LaundryOrder.GrandTotal,

            PaymentMethod = payment.PaymentMethod,

            PaymentStatus = payment.PaymentStatus,

            ReceiptFileName = payment.ReceiptFileName,

            ReceiptContentType = payment.ReceiptContentType,

            ReceiptFileSize = payment.ReceiptFileSize,

            ReceiptUploadedAt = payment.ReceiptUploadedAt,

            ConfirmedBy = payment.ConfirmedBy,

            ConfirmedAt = payment.ConfirmedAt,

            RejectedBy = payment.RejectedBy,

            RejectedAt = payment.RejectedAt,

            RejectionReason = payment.RejectionReason,

            CreatedAt = payment.CreatedAt
        };
    }
}
