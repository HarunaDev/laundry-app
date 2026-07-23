using LaundryApp.DTO.Responses;
using LaundryApp.DTO.User;
using LaundryApp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaundryApp.Controllers;

[ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
    }

    // GET ALL CLIENTS
    // Only SuperAdmin

    [HttpGet]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUsers(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var (items, meta) =
            await _userService.GetUsersAsync(pageNumber, pageSize);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Users retrieved successfully.",
            Data = new
            {
                Meta = meta,
                Users = items
            }
        });
    }

    // GET USER 
    // Only by current User
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(ApiResponse<UserResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCurrentUser()
    {
        var user = await _userService.GetCurrentUserAsync(User);

        return Ok(new ApiResponse<UserResponseDto>
        {
            Success = true,
            Message = "Current user retrieved successfully.",
            Data = user
        });
    }

    // GET USER BY ID
    // Only SuperAdmin

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<UserResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUser(string id)
    {
        var result = await _userService.GetUserByIdAsync(id);

        return Ok(new ApiResponse<UserResponseDto>
        {
            Success = true,
            Message = "User retrieved successfully.",
            Data = result
        });
    }

    // UPDATE OWN PROFILE
    // Any authenticated Client

    [HttpPut("{id}")]
    [Authorize(Roles = "Client")]
    [ProducesResponseType(typeof(ApiResponse<UserResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateUser(
        string id,
        UpdateUserDto dto)
    {
        var result =
            await _userService.UpdateUserAsync(id, dto, User);

        return Ok(new ApiResponse<UserResponseDto>
        {
            Success = true,
            Message = "Profile updated successfully.",
            Data = result
        });
    }

    // SOFT DELETE USER
    // Client (self)
    [HttpDelete("me")]
    [Authorize(Roles = "Client")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteMyAccount()
    {
        await _userService.DeleteCurrentUserAsync(User);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "Account deleted successfully."
        });
    }

    // SOFT DELETE USER
    // SuperAdmin (any client)
    [HttpDelete("{id}")]
    [Authorize(Roles = "SuperAdmin")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteUser(string id)
    {
        await _userService.DeleteUserAsync(id, User);

        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "User deleted successfully."
        });
    }
}