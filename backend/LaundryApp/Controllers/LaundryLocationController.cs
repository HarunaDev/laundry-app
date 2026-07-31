using LaundryApp.DTO.LaundryLocation;
using LaundryApp.DTO.Responses;
using LaundryApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaundryApp.Controllers;

[ApiController]
[Route("api/laundry-locations")]
[ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
public class LaundryLocationController : ControllerBase
{
    private readonly LaundryLocationService _laundryLocationService;

    public LaundryLocationController(
        LaundryLocationService laundryLocationService)
    {
        _laundryLocationService = laundryLocationService;
    }

    // CREATE LOCATION
    // Admin & SuperAdmin

    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<LaundryLocationResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create(
        CreateLaundryLocationDto dto)
    {
        var result = await _laundryLocationService.CreateAsync(dto);

        return Ok(new ApiResponse<LaundryLocationResponseDto>
        {
            Success = true,
            Message = "Laundry location created successfully.",
            Data = result
        });
    }

    // GET ALL LOCATIONS
    // Authenticated Users
    
    [HttpGet]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<LaundryLocationDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var result = await _laundryLocationService.GetAllAsync();

        return Ok(new ApiResponse<IEnumerable<LaundryLocationDto>>
        {
            Success = true,
            Message = "Laundry locations retrieved successfully.",
            Data = result
        });
    }

    // GET LOCATION BY ID
    // Authenticated Users

    [HttpGet("{id:int}")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<LaundryLocationResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(int id)
    {
        var result =
            await _laundryLocationService.GetByIdAsync(id);

        return Ok(new ApiResponse<LaundryLocationResponseDto>
        {
            Success = true,
            Message = "Laundry location retrieved successfully.",
            Data = result
        });
    }

    // UPDATE LOCATION
    // Admin & SuperAdmin

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<LaundryLocationResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(
        int id,
        UpdateLaundryLocationDto dto)
    {
        var result =
            await _laundryLocationService.UpdateAsync(id, dto);

        return Ok(new ApiResponse<LaundryLocationResponseDto>
        {
            Success = true,
            Message = "Laundry location updated successfully.",
            Data = result
        });
    }

    // DELETE LOCATION (SOFT DELETE)
    // Admin & SuperAdmin

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete(int id)
    {
        await _laundryLocationService.DeleteAsync(id, User);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Laundry location deleted successfully."
        });
    }
}