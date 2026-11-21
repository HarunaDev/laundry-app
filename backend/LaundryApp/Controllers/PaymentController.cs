
// using LaundryApp.DTO.Payment;
// using LaundryApp.DTO.Responses;
// using LaundryApp.Services;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;

// namespace LaundryApp.Controllers;

// [ApiController]
// [Route("api/payments")]
// public class PaymentController : ControllerBase
// {
//     private readonly PaymentService _paymentService;

//     public PaymentController(PaymentService paymentService)
//     {
//         _paymentService = paymentService;
//     }


//     [HttpGet]
//     [Authorize(Roles = "Admin,SuperAdmin")]
//     [ProducesResponseType(
//         typeof(ApiResponse<PagedResponse<PaymentResponseDto>>),
//         StatusCodes.Status200OK)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
//     public async Task<IActionResult> GetAllPayments(
//         [FromQuery] PaymentQueryDto filters)
//     {
//         var result = await _paymentService.GetAllAsync(filters);

//         return Ok(new ApiResponse<PagedResponse<PaymentResponseDto>>
//         {
//             Success = true,
//             Message = "Payments retrieved successfully.",
//             Data = result
//         });
//     }

//     [HttpGet("my")]
//     [Authorize(Roles = "Client")]
//     [ProducesResponseType(
//         typeof(ApiResponse<PagedResponse<PaymentResponseDto>>),
//         StatusCodes.Status200OK)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
//     public async Task<IActionResult> GetMyPayments(
//         [FromQuery] PaymentQueryDto filters)
//     {
//         var result = await _paymentService.GetMyPaymentsAsync(
//             filters,
//             User);

//         return Ok(new ApiResponse<PagedResponse<PaymentResponseDto>>
//         {
//             Success = true,
//             Message = "Payment history retrieved successfully.",
//             Data = result
//         });
//     }

//     // ==========================================================
//     // GET PAYMENT DETAILS
//     //
//     // CLIENT / ADMIN / SUPERADMIN
//     // ==========================================================

//     [HttpGet("orders/{orderId:int}")]
//     [Authorize(Roles = "Client,Admin,SuperAdmin")]
//     [ProducesResponseType(
//         typeof(ApiResponse<IEnumerable<PaymentResponseDto>>),
//         StatusCodes.Status200OK)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
//     public async Task<IActionResult> GetPayment(int orderId)
//     {
//         var result = await _paymentService.GetByOrderIdAsync(
//             orderId,
//             User);

//         return Ok(new ApiResponse<PaymentResponseDto>
//         {
//             Success = true,
//             Message = "Payment retrieved successfully.",
//             Data = result
//         });
//     }

//     // ==========================================================
//     // UPLOAD PAYMENT RECEIPT
//     //
//     // CLIENT ONLY
//     // ==========================================================

//     [HttpPost("orders/{orderId:int}/receipt")]
//     [Authorize(Roles = "Client,Admin,SuperAdmin")]
//     [Consumes("multipart/form-data")]
//     [ProducesResponseType(
//         typeof(ApiResponse<PaymentResponseDto>),
//         StatusCodes.Status201Created)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
//     public async Task<IActionResult> UploadReceipt(
//     [FromRoute] int orderId,
//     IFormFile file)
//     {
//         var result = await _paymentService.UploadReceiptAsync(
//             orderId,
//             file,
//             User);

//         return Ok(new ApiResponse<PaymentResponseDto>
//         {
//             Success = true,
//             Message = "Payment receipt uploaded successfully.",
//             Data = result
//         });
//     }

//     // ==========================================================
//     // CONFIRM PAYMENT
//     //
//     // ADMIN / SUPERADMIN ONLY
//     // ==========================================================

//     [HttpPut("orders/{orderId:int}/confirm")]
//     [Authorize(Roles = "Admin,SuperAdmin")]
//     [ProducesResponseType(
//         typeof(ApiResponse<PaymentResponseDto>),
//         StatusCodes.Status200OK)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
//     public async Task<IActionResult> ConfirmPayment(int orderId)
//     {
//         var result = await _paymentService.ConfirmPaymentAsync(
//             orderId,
//             User);

//         return Ok(new ApiResponse<PaymentResponseDto>
//         {
//             Success = true,
//             Message = "Payment confirmed successfully.",
//             Data = result
//         });
//     }

//     // ==========================================================
//     // REJECT PAYMENT
//     //
//     // ADMIN / SUPERADMIN ONLY
//     // ==========================================================

//     [HttpPut("orders/{orderId:int}/reject")]
//     [Authorize(Roles = "Admin,SuperAdmin")]
//     [ProducesResponseType(
//         typeof(ApiResponse<PaymentResponseDto>),
//         StatusCodes.Status200OK)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
//     public async Task<IActionResult> RejectPayment(
//         int orderId,
//         [FromBody] RejectPaymentDto dto)
//     {
//         var result = await _paymentService.RejectPaymentAsync(
//             orderId,
//             dto,
//             User);

//         return Ok(new ApiResponse<PaymentResponseDto>
//         {
//             Success = true,
//             Message = "Payment rejected successfully.",
//             Data = result
//         });
//     }

//     // ==========================================================
//     // VIEW PAYMENT RECEIPT
//     //
//     // ADMIN / SUPERADMIN ONLY
//     // ==========================================================

//     [HttpGet("orders/{orderId:int}/receipt")]
//     [Authorize(Roles = "Admin,SuperAdmin")]
//     [ProducesResponseType(
//         typeof(ApiResponse<PaymentResponseDto>),
//         StatusCodes.Status200OK)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
//     [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
//     public async Task<IActionResult> GetReceipt(int orderId)
//     {
//         var receipt = await _paymentService.GetReceiptAsync(
//             orderId);

//         return File(
//             receipt.Stream,
//             receipt.ContentType,
//             receipt.FileName);
//     }
// }



using LaundryApp.DTO.Payment;
using LaundryApp.DTO.Responses;
using LaundryApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaundryApp.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentController : ControllerBase
{
    private readonly PaymentService _paymentService;

    public PaymentController(PaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    // ==========================================================
    // GET ALL PAYMENTS
    // ADMIN / SUPERADMIN
    // ==========================================================

    [HttpGet]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(
        typeof(ApiResponse<PagedResponse<PaymentResponseDto>>),
        StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetAllPayments(
        [FromQuery] PaymentQueryDto filters)
    {
        var result = await _paymentService.GetAllAsync(filters);

        return Ok(new ApiResponse<PagedResponse<PaymentResponseDto>>
        {
            Success = true,
            Message = "Payments retrieved successfully.",
            Data = result
        });
    }

    // ==========================================================
    // GET MY PAYMENTS
    // CLIENT
    // ==========================================================

    [HttpGet("my")]
    [Authorize(Roles = "Client")]
    [ProducesResponseType(
        typeof(ApiResponse<PagedResponse<PaymentResponseDto>>),
        StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetMyPayments(
        [FromQuery] PaymentQueryDto filters)
    {
        var result = await _paymentService.GetMyPaymentsAsync(
            filters,
            User);

        return Ok(new ApiResponse<PagedResponse<PaymentResponseDto>>
        {
            Success = true,
            Message = "Payment history retrieved successfully.",
            Data = result
        });
    }

    // ==========================================================
    // GET PAYMENT DETAILS
    // CLIENT / ADMIN / SUPERADMIN
    // ==========================================================

    [HttpGet("orders/{orderId:int}")]
    [Authorize(Roles = "Client,Admin,SuperAdmin")]
    [ProducesResponseType(
        typeof(ApiResponse<PaymentResponseDto>),
        StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPayment(int orderId)
    {
        var result = await _paymentService.GetByOrderIdAsync(
            orderId,
            User);

        return Ok(new ApiResponse<PaymentResponseDto>
        {
            Success = true,
            Message = "Payment retrieved successfully.",
            Data = result
        });
    }

    // ==========================================================
    // UPLOAD PAYMENT RECEIPT
    // CLIENT / ADMIN / SUPERADMIN
    // ==========================================================

    [HttpPost("orders/{orderId:int}/receipt")]
    [Authorize(Roles = "Client,Admin,SuperAdmin")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(
        typeof(ApiResponse<PaymentResponseDto>),
        StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UploadReceipt(
        [FromRoute] int orderId,
        IFormFile file)
    {
        var result = await _paymentService.UploadReceiptAsync(
            orderId,
            file,
            User);

        return Ok(new ApiResponse<PaymentResponseDto>
        {
            Success = true,
            Message = "Payment receipt uploaded successfully.",
            Data = result
        });
    }

    // ==========================================================
    // CONFIRM PAYMENT
    // ADMIN / SUPERADMIN
    // ==========================================================

    [HttpPut("orders/{orderId:int}/confirm")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(
        typeof(ApiResponse<PaymentResponseDto>),
        StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ConfirmPayment(int orderId)
    {
        var result = await _paymentService.ConfirmPaymentAsync(
            orderId,
            User);

        return Ok(new ApiResponse<PaymentResponseDto>
        {
            Success = true,
            Message = "Payment confirmed successfully.",
            Data = result
        });
    }

    // ==========================================================
    // REJECT PAYMENT
    // ADMIN / SUPERADMIN
    // ==========================================================

    [HttpPut("orders/{orderId:int}/reject")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(
        typeof(ApiResponse<PaymentResponseDto>),
        StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> RejectPayment(
        int orderId,
        [FromBody] RejectPaymentDto dto)
    {
        var result = await _paymentService.RejectPaymentAsync(
            orderId,
            dto,
            User);

        return Ok(new ApiResponse<PaymentResponseDto>
        {
            Success = true,
            Message = "Payment rejected successfully.",
            Data = result
        });
    }

    // ==========================================================
    // GET RECEIPT HISTORY
    // ADMIN / SUPERADMIN
    // ==========================================================

    [HttpGet("orders/{orderId:int}/receipts")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(
        typeof(ApiResponse<IEnumerable<PaymentReceiptResponseDto>>),
        StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetReceiptHistory(int orderId)
    {
        var result = await _paymentService.GetReceiptHistoryAsync(orderId);

        return Ok(new ApiResponse<IEnumerable<PaymentReceiptResponseDto>>
        {
            Success = true,
            Message = "Payment receipt history retrieved successfully.",
            Data = result
        });
    }

    // ==========================================================
    // VIEW CURRENT RECEIPT
    // ADMIN / SUPERADMIN
    // ==========================================================

    [HttpGet("orders/{orderId:int}/receipt")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetReceipt(int orderId)
    {
        var receipt = await _paymentService.GetReceiptAsync(orderId);

        return File(
            receipt.Stream,
            receipt.ContentType,
            receipt.FileName);
    }

    // ==========================================================
    // DOWNLOAD HISTORICAL RECEIPT
    // ADMIN / SUPERADMIN
    // ==========================================================

    [HttpGet("orders/{orderId:int}/receipts/{receiptId:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetHistoricalReceipt(
        int orderId,
        int receiptId)
    {
        var receipt = await _paymentService.GetReceiptAsync(
            orderId,
            receiptId);

        return File(
            receipt.Stream,
            receipt.ContentType,
            receipt.FileName);
    }
}
