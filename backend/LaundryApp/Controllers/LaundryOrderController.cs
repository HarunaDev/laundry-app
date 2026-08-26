using System.Security.Claims;
using LaundryApp.DTO.LaundryOrder;
using LaundryApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaundryApp.Controllers;

[ApiController]
[Route("api/laundry-orders")]
[Authorize]
public class LaundryOrderServiceController : ControllerBase
{
    private readonly LaundryOrderService _orderService;

    public LaundryOrderServiceController(
        LaundryOrderService orderService)
    {
        _orderService = orderService;
    }


    // ==========================================================
    // CREATE ORDER
    //
    // CLIENT:
    // Creates an order for themselves.
    //
    // ADMIN / SUPERADMIN:
    // Can create an order for a specific client using UserId.
    // ==========================================================

    [HttpPost]
    [ProducesResponseType(
        typeof(LaundryOrderResponseDto),
        StatusCodes.Status201Created)]
    [ProducesResponseType(
        StatusCodes.Status400BadRequest)]
    [ProducesResponseType(
        StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(
        StatusCodes.Status404NotFound)]
    public async Task<ActionResult<LaundryOrderResponseDto>>
        CreateOrder(
            [FromBody] CreateLaundryOrderDto dto)
    {
        var result =
            await _orderService.CreateOrderAsync(
                dto,
                User);

        return CreatedAtAction(
            nameof(GetOrderById),
            new { orderId = result.Id },
            result);
    }


    // ==========================================================
    // GET ORDER BY ID
    //
    // CLIENT:
    // Can only access their own order.
    //
    // ADMIN / SUPERADMIN:
    // Can access any order.
    // ==========================================================

    [HttpGet("{orderId:int}")]
    [ProducesResponseType(
        typeof(LaundryOrderResponseDto),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(
        StatusCodes.Status404NotFound)]
    public async Task<ActionResult<LaundryOrderResponseDto>>
        GetOrderById(
            int orderId)
    {
        var result =
            await _orderService.GetByIdAsync(
                orderId,
                User);

        return Ok(result);
    }


    // ==========================================================
    // GET CURRENT USER ORDERS
    //
    // CLIENT ONLY
    // ==========================================================

    [HttpGet("my-orders")]
    [Authorize(Roles = "Client")]
    [ProducesResponseType(
        typeof(IEnumerable<LaundryOrderDto>),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<IEnumerable<LaundryOrderDto>>>
        GetMyOrders()
    {
        var result =
            await _orderService.GetMyOrdersAsync(
                User);

        return Ok(result);
    }


    // ==========================================================
    // GET ALL ORDERS
    //
    // ADMIN / SUPERADMIN ONLY
    // ==========================================================

    [HttpPost("filter")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(
        typeof(IEnumerable<LaundryOrderDto>),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(
        StatusCodes.Status403Forbidden)]
    public async Task<ActionResult>
        GetAllOrders( [FromBody] GetLaundryOrdersDto dto)
    {
        var result =
            await _orderService.GetAllAsync(dto);

        return Ok(new
        {
            items = result.Items,
            meta = result.Meta
        }
        );
    }


    // ==========================================================
    // CONFIRM ORDER
    //
    // ADMIN / SUPERADMIN ONLY
    //
    // Pending -> InProgress
    // ==========================================================

    [HttpPut("{orderId:int}/confirm")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(
        typeof(LaundryOrderResponseDto),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        StatusCodes.Status400BadRequest)]
    [ProducesResponseType(
        StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(
        StatusCodes.Status403Forbidden)]
    [ProducesResponseType(
        StatusCodes.Status404NotFound)]
    public async Task<ActionResult<LaundryOrderResponseDto>>
        ConfirmOrder(
            int orderId,
            [FromBody] ConfirmLaundryOrderDto dto)
    {
        var result =
            await _orderService.ConfirmOrderAsync(
                orderId,
                dto,
                User);

        return Ok(result);
    }


    // ==========================================================
    // COMPLETE ORDER
    //
    // ADMIN / SUPERADMIN ONLY
    //
    // InProgress -> Completed
    // ==========================================================

    [HttpPut("{orderId:int}/complete")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(
        typeof(LaundryOrderResponseDto),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        StatusCodes.Status400BadRequest)]
    [ProducesResponseType(
        StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(
        StatusCodes.Status403Forbidden)]
    [ProducesResponseType(
        StatusCodes.Status404NotFound)]
    public async Task<ActionResult<LaundryOrderResponseDto>>
        CompleteOrder(
            int orderId)
    {
        var result =
            await _orderService.CompleteOrderAsync(
                orderId);

        return Ok(result);
    }
}