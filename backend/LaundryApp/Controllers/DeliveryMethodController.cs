using LaundryApp.DTO.DeliveryMethod;
using LaundryApp.DTO.Responses;
using LaundryApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaundryApp.Controllers;

[ApiController]
[Route("api/delivery-methods")]
[ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
public class DeliveryMethodController : ControllerBase
{
    private readonly DeliveryMethodService _deliveryMethodService;

    public DeliveryMethodController(
        DeliveryMethodService deliveryMethodService)
    {
        _deliveryMethodService = deliveryMethodService;
    }

    // CREATE DELIVERY METHOD
    // Admin & SuperAdmin
    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<DeliveryMethodResponseDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create(CreateDeliveryMethodDto dto)
    {
        var result = await _deliveryMethodService.CreateAsync(dto);

        return StatusCode(StatusCodes.Status201Created,
            new ApiResponse<DeliveryMethodResponseDto>
            {
                Success = true,
                Message = "Delivery method created successfully.",
                Data = result
            });
    }

    // GET ALL DELIVERY METHODS
    // Any authenticated user
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<DeliveryMethodDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var result = await _deliveryMethodService.GetAllAsync();

        return Ok(new ApiResponse<IEnumerable<DeliveryMethodDto>>
        {
            Success = true,
            Message = "Delivery methods retrieved successfully.",
            Data = result
        });
    }

    // GET DELIVERY METHOD BY ID
    // Any authenticated user
    [HttpGet("{id:int}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<DeliveryMethodResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _deliveryMethodService.GetByIdAsync(id);

        return Ok(new ApiResponse<DeliveryMethodResponseDto>
        {
            Success = true,
            Message = "Delivery method retrieved successfully.",
            Data = result
        });
    }

    // UPDATE DELIVERY METHOD
    // Admin & SuperAdmin
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<DeliveryMethodResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(
        int id,
        UpdateDeliveryMethodDto dto)
    {
        var result = await _deliveryMethodService.UpdateAsync(id, dto);

        return Ok(new ApiResponse<DeliveryMethodResponseDto>
        {
            Success = true,
            Message = "Delivery method updated successfully.",
            Data = result
        });
    }

    // DELETE DELIVERY METHOD
    // Admin & SuperAdmin
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete(int id)
    {
        await _deliveryMethodService.DeleteAsync(id, User);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Delivery method deleted successfully."
        });
    }
}