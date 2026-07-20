using LaundryApp.DTO.Auth;
using LaundryApp.DTO.Responses;
using LaundryApp.DTO.User;
using LaundryApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaundryApp.Controllers;

[ApiController]
[ProducesResponseType(typeof(ApiResponse<UserResponseDto>), StatusCodes.Status200OK)]
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

    [HttpPost("create")]
    public async Task<IActionResult> CreateAdmin(RegisterDto dto)
    {
        var result = await _adminService.CreateAdminAsync(dto, User);

        return StatusCode(StatusCodes.Status200OK,
            new ApiResponse<UserResponseDto>
            {
                Success = true,
                Message = "Admin created successfully.",
                Data = result
            });
    }
}