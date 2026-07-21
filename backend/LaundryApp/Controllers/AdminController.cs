using LaundryApp.DTO.Admin;
using LaundryApp.DTO.Responses;
using LaundryApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaundryApp.Controllers;

[ApiController]
[ProducesResponseType(typeof(ApiResponse<AdminResponseDto>), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
[Authorize(Roles = "SuperAdmin")]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly AdminService _adminService;

    public AdminController(AdminService adminService)
    {
        _adminService = adminService;
    }

    // create Admin
    [HttpPost("create")]
    public async Task<IActionResult> CreateAdmin(CreateAdminDto dto)
    {
        var result = await _adminService.CreateAdminAsync(dto, User);

        return StatusCode(StatusCodes.Status200OK,
            new ApiResponse<AdminResponseDto>
            {
                Success = true,
                Message = "Admin created successfully.",
                Data = result
            });
    }

    // get admins
    [HttpGet]
    public async Task<IActionResult> GetAdmins(
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 10)
    {
        var (items, meta) =
            await _adminService.GetAdminsAsync(pageNumber, pageSize);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Admins retrieved successfully.",
            Data = new
            {
                Meta = meta,
                Admins = items
            }
        });
    }

    // get admin by id
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAdmin(string id)
    {
        var admin =
            await _adminService.GetAdminByIdAsync(id);

        return Ok(new ApiResponse<AdminResponseDto>
        {
            Success = true,
            Message = "Admin retrieved successfully.",
            Data = admin
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAdmin(string id)
    {
        await _adminService.DeleteAdminAsync(id, User);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Admin deleted successfully."
        });
    }
}