using LaundryApp.DTO.LaundryService;
using LaundryApp.DTO.Responses;
using LaundryApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaundryApp.Controllers;

[ApiController]
[Route("api/laundry-services")]
[ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
public class LaundryServiceController : ControllerBase
{
    private readonly LaundryServiceService _laundryServiceService;

    public LaundryServiceController(
        LaundryServiceService laundryServiceService)
    {
        _laundryServiceService = laundryServiceService;
    }

    // CREATE LAUNDRY SERVICE
    // Admin & SuperAdmin

    [HttpPost]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<LaundryServiceResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create(
        CreateLaundryServiceDto dto)
    {
        var result = await _laundryServiceService.CreateAsync(dto, User);

        return Ok(new ApiResponse<LaundryServiceResponseDto>
        {
            Success = true,
            Message = "Laundry service created successfully.",
            Data = result
        });
    }

    // GET ALL SERVICES
    // Client, Admin & SuperAdmin

    [HttpGet]
    [Authorize(Roles = "Client,Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<LaundryServiceDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var result = await _laundryServiceService.GetAllAsync();

        return Ok(new ApiResponse<IEnumerable<LaundryServiceDto>>
        {
            Success = true,
            Message = "Laundry services retrieved successfully.",
            Data = result
        });
    }

    // GET SERVICE BY ID
    // Client, Admin & SuperAdmin

    [HttpGet("{id}")]
    [Authorize(Roles = "Client,Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<LaundryServiceResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _laundryServiceService.GetByIdAsync(id);

        return Ok(new ApiResponse<LaundryServiceResponseDto>
        {
            Success = true,
            Message = "Laundry service retrieved successfully.",
            Data = result
        });
    }

    // UPDATE SERVICE
    // Admin & SuperAdmin

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<LaundryServiceResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(
        int id,
        UpdateLaundryServiceDto dto)
    {
        var result = await _laundryServiceService.UpdateAsync(id, dto);

        return Ok(new ApiResponse<LaundryServiceResponseDto>
        {
            Success = true,
            Message = "Laundry service updated successfully.",
            Data = result
        });
    }

    // DELETE SERVICE (SOFT DELETE)
    // Admin & SuperAdmin

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete(int id)
    {
        await _laundryServiceService.DeleteAsync(id, User);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Laundry service deleted successfully."
        });
    }
}