
using System.Security.Claims;
using LaundryApp.Data;
using LaundryApp.DTO.Payment;
using LaundryApp.DTO.Responses;
using LaundryApp.Exceptions;
using LaundryApp.Models;
using Microsoft.EntityFrameworkCore;

namespace LaundryApp.Services;

public class PaymentService
{
    private readonly LaundryAppDbContext _context;
    // private readonly IWebHostEnvironment _environment;
    private readonly IReceiptStorageService _receiptStorage;
    private readonly ILogger<PaymentService> _logger;

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
        IReceiptStorageService receiptStorage, ILogger<PaymentService> logger)
    {
        _context = context;
        _receiptStorage = receiptStorage;
        _logger = logger;
    }

    // ==========================================================
    // GET ALL PAYMENTS 
    // ==========================================================
    public async Task<PagedResponse<PaymentResponseDto>> GetAllAsync(
        PaymentQueryDto filters)
    {
        if (filters.FromDate.HasValue &&
            filters.ToDate.HasValue &&
            filters.FromDate.Value > filters.ToDate.Value)
        {
            throw new BadRequestException(
                "FromDate cannot be later than ToDate.");
        }

        var query = _context.Payments
            .AsNoTracking()
            .Include(p => p.LaundryOrder)
            .Where(p => !p.LaundryOrder.IsDeleted);

        // Filter by payment status.
        if (filters.PaymentStatus.HasValue)
        {
            query = query.Where(p =>
                p.PaymentStatus == filters.PaymentStatus.Value);
        }

        // Filter by payment method.
        if (filters.PaymentMethod.HasValue)
        {
            query = query.Where(p =>
                p.PaymentMethod == filters.PaymentMethod.Value);
        }

        // Filter by order ID.
        if (filters.LaundryOrderId.HasValue)
        {
            query = query.Where(p =>
                p.LaundryOrderId == filters.LaundryOrderId.Value);
        }

        // Filter by creation date.
        if (filters.FromDate.HasValue)
        {
            query = query.Where(p =>
                p.CreatedAt >= filters.FromDate.Value);
        }

        if (filters.ToDate.HasValue)
        {
            query = query.Where(p =>
                p.CreatedAt <= filters.ToDate.Value);
        }

        // Get the total number of matching records before pagination.
        var totalRecords = await query.CountAsync();

        // Apply pagination.
        var payments = await query
            .OrderByDescending(p => p.CreatedAt)
            .ThenByDescending(p => p.Id)
            .Skip((filters.PageNumber - 1) * filters.PageSize)
            .Take(filters.PageSize)
            .ToListAsync();

        var items = payments
            .Select(MapToResponse)
            .ToList();

        return new PagedResponse<PaymentResponseDto>
        {
            PageNumber = filters.PageNumber,
            PageSize = filters.PageSize,
            TotalRecords = totalRecords,
            Items = items
        };
    }


    // ==========================================================
    // GET PERSONALIZED PAYMENT 
    // ==========================================================


    public async Task<PagedResponse<PaymentResponseDto>> GetMyPaymentsAsync(
        PaymentQueryDto filters,
        ClaimsPrincipal currentUser)
    {
        var userId = GetCurrentUserId(currentUser);

        if (filters.FromDate.HasValue &&
            filters.ToDate.HasValue &&
            filters.FromDate.Value > filters.ToDate.Value)
        {
            throw new BadRequestException(
                "FromDate cannot be later than ToDate.");
        }

        var query = _context.Payments
            .AsNoTracking()
            .Include(p => p.LaundryOrder)
            .Where(p =>
                p.LaundryOrder.UserId == userId &&
                !p.LaundryOrder.IsDeleted);

        if (filters.PaymentStatus.HasValue)
        {
            query = query.Where(p =>
                p.PaymentStatus == filters.PaymentStatus.Value);
        }

        if (filters.PaymentMethod.HasValue)
        {
            query = query.Where(p =>
                p.PaymentMethod == filters.PaymentMethod.Value);
        }

        if (filters.FromDate.HasValue)
        {
            query = query.Where(p =>
                p.CreatedAt >= filters.FromDate.Value);
        }

        if (filters.ToDate.HasValue)
        {
            query = query.Where(p =>
                p.CreatedAt <= filters.ToDate.Value);
        }

        var totalRecords = await query.CountAsync();

        var payments = await query
            .OrderByDescending(p => p.CreatedAt)
            .ThenByDescending(p => p.Id)
            .Skip((filters.PageNumber - 1) * filters.PageSize)
            .Take(filters.PageSize)
            .ToListAsync();

        return new PagedResponse<PaymentResponseDto>
        {
            PageNumber = filters.PageNumber,
            PageSize = filters.PageSize,
            TotalRecords = totalRecords,
            Items = payments.Select(MapToResponse).ToList()
        };
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

    // public async Task<PaymentResponseDto> UploadReceiptAsync(
    //     int orderId,
    //     IFormFile file,
    //     ClaimsPrincipal currentUser)
    // {
    //     // var userId = GetCurrentUserId(currentUser);

    //     var payment = await GetPaymentAsync(orderId);

    //     EnsureReceiptUploadAccess(payment, currentUser);

    //     if (payment.PaymentMethod != PaymentMethod.Transfer)
    //     {
    //         throw new BadRequestException(
    //             "Receipt uploads are only allowed for bank transfers.");
    //     }

    //     if (payment.PaymentStatus == PaymentStatus.Paid)
    //     {
    //         throw new BadRequestException(
    //             "Payment has already been confirmed.");
    //     }

    //     ValidateReceipt(file);

    //     var extension = AllowedContentTypes[file.ContentType];

    //     var fileName = $"{Guid.NewGuid():N}{extension}";

    //     var uploadDirectory = Path.Combine(
    //         _environment.ContentRootPath,
    //         "App_Data",
    //         "PaymentReceipts");

    //     Directory.CreateDirectory(uploadDirectory);

    //     var filePath = Path.Combine(
    //         uploadDirectory,
    //         fileName);

    //     await using (var stream = new FileStream(
    //         filePath,
    //         FileMode.CreateNew,
    //         FileAccess.Write,
    //         FileShare.None,
    //         81920,
    //         useAsync: true))
    //     {
    //         await file.CopyToAsync(stream);
    //     }

    //     // Remove the previous receipt after the new one
    //     // has been successfully saved.

    //     var uploadedAt = DateTime.UtcNow;

    //     // Mark the previous submission as no longer current.
    //     // Its metadata and physical file are retained.
    //     foreach (var previousReceipt in payment.Receipts
    //         .Where(r => r.IsCurrent))
    //     {
    //         previousReceipt.IsCurrent = false;
    //     }

    //     // Create a new receipt history record.
    //     var receipt = new PaymentReceipt
    //     {
    //         PaymentId = payment.Id,
    //         FilePath = fileName,
    //         FileName = Path.GetFileName(file.FileName),
    //         ContentType = file.ContentType,
    //         FileSize = file.Length,
    //         UploadedAt = uploadedAt,
    //         IsCurrent = true,
    //         IsRejected = false
    //     };

    //     _context.PaymentReceipts.Add(receipt);

    //     // Keep the existing Payment receipt fields synchronized
    //     // for compatibility with your current PaymentResponseDto.
    //     payment.ReceiptPath = fileName;
    //     payment.ReceiptFileName = receipt.FileName;
    //     payment.ReceiptContentType = file.ContentType;
    //     payment.ReceiptFileSize = file.Length;
    //     payment.ReceiptUploadedAt = uploadedAt;

    //     // A rejected payment can be resubmitted.
    //     payment.PaymentStatus = PaymentStatus.Pending;

    //     payment.RejectedBy = null;
    //     payment.RejectedAt = null;
    //     payment.RejectionReason = null;

    //     payment.UpdatedAt = uploadedAt;

    //     try
    //     {
    //         await _context.SaveChangesAsync();
    //     }
    //     catch
    //     {
    //         // Avoid leaving an orphaned file if the database save fails.
    //         if (File.Exists(filePath))
    //         {
    //             File.Delete(filePath);
    //         }

    //         throw;
    //     }

    //     return MapToResponse(payment);

    // }


    public async Task<PaymentResponseDto> UploadReceiptAsync(
        int orderId,
        IFormFile file,
        ClaimsPrincipal currentUser)
    {
        var payment = await GetPaymentAsync(orderId);

        EnsureReceiptUploadAccess(payment, currentUser);

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

        await using var stream = file.OpenReadStream();

        await _receiptStorage.UploadAsync(
            stream,
            fileName,
            file.ContentType);

        var uploadedAt = DateTime.UtcNow;

        foreach (var previousReceipt in payment.Receipts
            .Where(r => r.IsCurrent))
        {
            previousReceipt.IsCurrent = false;
        }

        var receipt = new PaymentReceipt
        {
            PaymentId = payment.Id,
            FilePath = fileName,
            FileName = Path.GetFileName(file.FileName),
            ContentType = file.ContentType,
            FileSize = file.Length,
            UploadedAt = uploadedAt,
            IsCurrent = true,
            IsRejected = false
        };

        _context.PaymentReceipts.Add(receipt);

        payment.ReceiptPath = fileName;
        payment.ReceiptFileName = receipt.FileName;
        payment.ReceiptContentType = file.ContentType;
        payment.ReceiptFileSize = file.Length;
        payment.ReceiptUploadedAt = uploadedAt;

        payment.PaymentStatus = PaymentStatus.Pending;

        payment.RejectedBy = null;
        payment.RejectedAt = null;
        payment.RejectionReason = null;

        payment.UpdatedAt = uploadedAt;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch
        {
            try
            {
                await _receiptStorage.DeleteAsync(fileName);
            }
            catch (Exception cleanupException)
            {
                _logger.LogError(
                    cleanupException,
                    "Failed to remove receipt {FileName} after database save failure.",
                    fileName);
            }

            throw;
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

        // payment.PaymentStatus = PaymentStatus.Rejected;

        // payment.RejectedBy = adminId;
        // payment.RejectedAt = DateTime.UtcNow;

        // payment.RejectionReason = dto.Reason.Trim();

        // payment.UpdatedAt = DateTime.UtcNow;


        var rejectedAt = DateTime.UtcNow;

        payment.PaymentStatus = PaymentStatus.Rejected;

        payment.RejectedBy = adminId;
        payment.RejectedAt = rejectedAt;
        payment.RejectionReason = dto.Reason.Trim();

        var currentReceipt = payment.Receipts
            .FirstOrDefault(r => r.IsCurrent);

        if (currentReceipt is not null)
        {
            currentReceipt.IsRejected = true;
            currentReceipt.IsCurrent = false;
            currentReceipt.RejectedBy = adminId;
            currentReceipt.RejectedAt = rejectedAt;
            currentReceipt.RejectionReason = dto.Reason.Trim();
        }

        payment.UpdatedAt = rejectedAt;
        await _context.SaveChangesAsync();

        return MapToResponse(payment);
    }

    // ==========================================================
    // GET RECEIPT FILE
    //
    // ADMIN / SUPERADMIN ONLY
    // ==========================================================

    // public async Task<(Stream Stream, string ContentType, string FileName)>
    //     GetReceiptAsync(int orderId)
    // {
    //     var payment = await GetPaymentAsync(orderId);

    //     if (string.IsNullOrWhiteSpace(payment.ReceiptPath))
    //     {
    //         throw new NotFoundException(
    //             "Payment receipt not found.");
    //     }

    //     var uploadDirectory = Path.Combine(
    //         _environment.ContentRootPath,
    //         "App_Data",
    //         "PaymentReceipts");

    //     var filePath = Path.Combine(
    //         uploadDirectory,
    //         Path.GetFileName(payment.ReceiptPath));

    //     if (!File.Exists(filePath))
    //     {
    //         throw new NotFoundException(
    //             "Payment receipt file not found.");
    //     }

    //     var stream = new FileStream(
    //         filePath,
    //         FileMode.Open,
    //         FileAccess.Read,
    //         FileShare.Read,
    //         81920,
    //         useAsync: true);

    //     return (
    //         stream,
    //         payment.ReceiptContentType ?? "application/octet-stream",
    //         payment.ReceiptFileName ?? "receipt"
    //     );
    // }


    public async Task<(Stream Stream, string ContentType, string FileName)>
        GetReceiptAsync(int orderId)
    {
        var payment = await GetPaymentAsync(orderId);

        if (string.IsNullOrWhiteSpace(payment.ReceiptPath))
        {
            throw new NotFoundException(
                "Payment receipt not found.");
        }

        if (!await _receiptStorage.ExistsAsync(payment.ReceiptPath))
        {
            throw new NotFoundException(
                "Payment receipt file not found.");
        }

        var stream = await _receiptStorage.DownloadAsync(
            payment.ReceiptPath);

        return (
            stream,
            payment.ReceiptContentType ?? "application/octet-stream",
            payment.ReceiptFileName ?? "receipt"
        );
    }



    // public async Task<(Stream Stream, string ContentType, string FileName)>
    //     GetReceiptAsync(int orderId, int receiptId)
    // {
    //     var payment = await GetPaymentAsync(orderId);

    //     var receipt = payment.Receipts
    //         .FirstOrDefault(r => r.Id == receiptId);

    //     if (receipt is null)
    //     {
    //         throw new NotFoundException(
    //             "Payment receipt not found.");
    //     }

    //     if (receipt.FileDeletedAt.HasValue)
    //     {
    //         throw new NotFoundException(
    //             "This receipt file has expired and is no longer available.");
    //     }

    //     var uploadDirectory = Path.Combine(
    //         _environment.ContentRootPath,
    //         "App_Data",
    //         "PaymentReceipts");

    //     var filePath = Path.Combine(
    //         uploadDirectory,
    //         Path.GetFileName(receipt.FilePath));

    //     if (!File.Exists(filePath))
    //     {
    //         throw new NotFoundException(
    //             "Payment receipt file not found.");
    //     }

    //     var stream = new FileStream(
    //         filePath,
    //         FileMode.Open,
    //         FileAccess.Read,
    //         FileShare.Read,
    //         81920,
    //         useAsync: true);

    //     return (
    //         stream,
    //         receipt.ContentType,
    //         receipt.FileName
    //     );
    // }


    public async Task<(Stream Stream, string ContentType, string FileName)>
        GetReceiptAsync(int orderId, int receiptId)
    {
        var payment = await GetPaymentAsync(orderId);

        var receipt = payment.Receipts
            .FirstOrDefault(r => r.Id == receiptId);

        if (receipt is null)
        {
            throw new NotFoundException(
                "Payment receipt not found.");
        }

        if (receipt.FileDeletedAt.HasValue)
        {
            throw new NotFoundException(
                "This receipt file has expired and is no longer available.");
        }

        if (!await _receiptStorage.ExistsAsync(receipt.FilePath))
        {
            throw new NotFoundException(
                "Payment receipt file not found.");
        }

        var stream = await _receiptStorage.DownloadAsync(
            receipt.FilePath);

        return (
            stream,
            receipt.ContentType,
            receipt.FileName
        );
    }



    // ==========================================================
    // GET PAYMENT HISTORY
    // ==========================================================


    // public async Task<IEnumerable<PaymentReceiptResponseDto>>
    //     GetReceiptHistoryAsync(int orderId)
    // {
    //     var payment = await GetPaymentAsync(orderId);

    //     var uploadDirectory = Path.Combine(
    //         _environment.ContentRootPath,
    //         "App_Data",
    //         "PaymentReceipts");

    //     return payment.Receipts
    //         .OrderByDescending(r => r.UploadedAt)
    //         .ThenByDescending(r => r.Id)
    //         .Select(receipt =>
    //         {
    //             var filePath = Path.Combine(
    //                 uploadDirectory,
    //                 Path.GetFileName(receipt.FilePath));

    //             return new PaymentReceiptResponseDto
    //             {
    //                 Id = receipt.Id,
    //                 PaymentId = receipt.PaymentId,
    //                 FileName = receipt.FileName,
    //                 ContentType = receipt.ContentType,
    //                 FileSize = receipt.FileSize,
    //                 UploadedAt = receipt.UploadedAt,
    //                 IsCurrent = receipt.IsCurrent,
    //                 IsRejected = receipt.IsRejected,
    //                 RejectedBy = receipt.RejectedBy,
    //                 RejectedAt = receipt.RejectedAt,
    //                 RejectionReason = receipt.RejectionReason,
    //                 FileDeletedAt = receipt.FileDeletedAt,
    //                 IsFileAvailable =
    //                     receipt.FileDeletedAt is null &&
    //                     File.Exists(filePath)
    //             };
    //         })
    //         .ToList();
    // }



    public async Task<IEnumerable<PaymentReceiptResponseDto>>
        GetReceiptHistoryAsync(int orderId)
    {
        var payment = await GetPaymentAsync(orderId);

        var history = new List<PaymentReceiptResponseDto>();

        foreach (var receipt in payment.Receipts
            .OrderByDescending(r => r.UploadedAt)
            .ThenByDescending(r => r.Id))
        {
            var isFileAvailable =
                receipt.FileDeletedAt is null &&
                await _receiptStorage.ExistsAsync(receipt.FilePath);

            history.Add(new PaymentReceiptResponseDto
            {
                Id = receipt.Id,
                PaymentId = receipt.PaymentId,
                FileName = receipt.FileName,
                ContentType = receipt.ContentType,
                FileSize = receipt.FileSize,
                UploadedAt = receipt.UploadedAt,
                IsCurrent = receipt.IsCurrent,
                IsRejected = receipt.IsRejected,
                RejectedBy = receipt.RejectedBy,
                RejectedAt = receipt.RejectedAt,
                RejectionReason = receipt.RejectionReason,
                FileDeletedAt = receipt.FileDeletedAt,
                IsFileAvailable = isFileAvailable
            });
        }

        return history;
    }



    // ==========================================================
    // PRIVATE HELPERS
    // ==========================================================


    private static void EnsureReceiptUploadAccess(
        Payment payment,
        ClaimsPrincipal currentUser)
    {
        var role = currentUser.FindFirstValue(ClaimTypes.Role);

        // Administrators can upload receipts for any order.
        if (role == UserRole.Admin.ToString() ||
            role == UserRole.SuperAdmin.ToString())
        {
            return;
        }

        // Clients can only upload receipts for their own orders.
        if (role == UserRole.Client.ToString())
        {
            EnsureOrderOwnership(
                payment,
                GetCurrentUserId(currentUser));

            return;
        }

        throw new UnauthorizedException(
            "You are not authorized to upload this payment receipt.");
    }


    private async Task<Payment> GetPaymentAsync(int orderId)
    {
        var payment = await _context.Payments
            .Include(p => p.LaundryOrder)
            .Include(p => p.Receipts)
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
