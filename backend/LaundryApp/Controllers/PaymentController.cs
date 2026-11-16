
using LaundryApp.DTO.Payment;
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


    [HttpGet]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> GetAllPayments(
        [FromQuery] PaymentQueryDto filters)
    {
        var result = await _paymentService.GetAllAsync(filters);

        return Ok(new
        {
            success = true,
            message = "Payments retrieved successfully.",
            data = result
        });
    }

    [HttpGet("my")]
    [Authorize(Roles = "Client")]
    public async Task<IActionResult> GetMyPayments(
        [FromQuery] PaymentQueryDto filters)
    {
        var result = await _paymentService.GetMyPaymentsAsync(
            filters,
            User);

        return Ok(new
        {
            success = true,
            message = "Payment history retrieved successfully.",
            data = result
        });
    }

    // ==========================================================
    // GET PAYMENT DETAILS
    //
    // CLIENT / ADMIN / SUPERADMIN
    // ==========================================================

    [HttpGet("orders/{orderId:int}")]
    [Authorize(Roles = "Client,Admin,SuperAdmin")]
    public async Task<IActionResult> GetPayment(int orderId)
    {
        var result = await _paymentService.GetByOrderIdAsync(
            orderId,
            User);

        return Ok(new
        {
            success = true,
            message = "Payment retrieved successfully.",
            data = result
        });
    }

    // ==========================================================
    // UPLOAD PAYMENT RECEIPT
    //
    // CLIENT ONLY
    // ==========================================================

    [HttpPost("orders/{orderId:int}/receipt")]
    [Authorize(Roles = "Client")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadReceipt(
    [FromRoute] int orderId,
    IFormFile file)
    {
        var result = await _paymentService.UploadReceiptAsync(
            orderId,
            file,
            User);

        return Ok(new
        {
            success = true,
            message = "Payment receipt uploaded successfully.",
            data = result
        });
    }

    // ==========================================================
    // CONFIRM PAYMENT
    //
    // ADMIN / SUPERADMIN ONLY
    // ==========================================================

    [HttpPut("orders/{orderId:int}/confirm")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> ConfirmPayment(int orderId)
    {
        var result = await _paymentService.ConfirmPaymentAsync(
            orderId,
            User);

        return Ok(new
        {
            success = true,
            message = "Payment confirmed successfully.",
            data = result
        });
    }

    // ==========================================================
    // REJECT PAYMENT
    //
    // ADMIN / SUPERADMIN ONLY
    // ==========================================================

    [HttpPut("orders/{orderId:int}/reject")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> RejectPayment(
        int orderId,
        [FromBody] RejectPaymentDto dto)
    {
        var result = await _paymentService.RejectPaymentAsync(
            orderId,
            dto,
            User);

        return Ok(new
        {
            success = true,
            message = "Payment rejected successfully.",
            data = result
        });
    }

    // ==========================================================
    // VIEW PAYMENT RECEIPT
    //
    // ADMIN / SUPERADMIN ONLY
    // ==========================================================

    [HttpGet("orders/{orderId:int}/receipt")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> GetReceipt(int orderId)
    {
        var receipt = await _paymentService.GetReceiptAsync(
            orderId);

        return File(
            receipt.Stream,
            receipt.ContentType,
            receipt.FileName);
    }
}
