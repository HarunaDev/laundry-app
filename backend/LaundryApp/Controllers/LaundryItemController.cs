using LaundryApp.DTO.LaundryItem;
using LaundryApp.DTO.Responses;
using LaundryApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaundryApp.Controllers;

[ApiController]
[Route("api/laundry-items")]
[ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
public class LaundryItemController : ControllerBase
{
    private readonly LaundryItemService _laundryItemService;

    public LaundryItemController(
        LaundryItemService laundryItemService)
    {
        _laundryItemService = laundryItemService;
    }

    // CREATE LAUNDRY ITEM
    // Admin & SuperAdmin

    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<LaundryItemResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create(
        CreateLaundryItemDto dto)
    {
        var result =
            await _laundryItemService.CreateAsync(dto);

        return Ok(new ApiResponse<LaundryItemResponseDto>
        {
            Success = true,
            Message = "Laundry item created successfully.",
            Data = result
        });
    }

    // GET ALL ITEMS
    // Everyone

    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<LaundryItemDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var result =
            await _laundryItemService.GetAllAsync();

        return Ok(new ApiResponse<IEnumerable<LaundryItemDto>>
        {
            Success = true,
            Message = "Laundry items retrieved successfully.",
            Data = result
        });
    }

    // GET ITEM BY ID
    // Everyone

    [HttpGet("{id:int}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<LaundryItemResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(int id)
    {
        var result =
            await _laundryItemService.GetByIdAsync(id);

        return Ok(new ApiResponse<LaundryItemResponseDto>
        {
            Success = true,
            Message = "Laundry item retrieved successfully.",
            Data = result
        });
    }

    // GET ITEMS UNDER A SERVICE
    // Everyone

    [HttpGet("service/{serviceId:int}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<LaundryItemDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByService(
        int serviceId)
    {
        var result =
            await _laundryItemService.GetByServiceAsync(serviceId);

        return Ok(new ApiResponse<IEnumerable<LaundryItemDto>>
        {
            Success = true,
            Message = "Laundry items retrieved successfully.",
            Data = result
        });
    }

    // UPDATE ITEM
    // Admin & SuperAdmin

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<LaundryItemResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(
        int id,
        UpdateLaundryItemDto dto)
    {
        var result =
            await _laundryItemService.UpdateAsync(id, dto);

        return Ok(new ApiResponse<LaundryItemResponseDto>
        {
            Success = true,
            Message = "Laundry item updated successfully.",
            Data = result
        });
    }

    // DELETE ITEM (SOFT DELETE)
    // Admin & SuperAdmin

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete(int id)
    {
        await _laundryItemService.DeleteAsync(id, User);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Laundry item deleted successfully."
        });
    }
}