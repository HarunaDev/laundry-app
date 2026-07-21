using Microsoft.AspNetCore.Mvc;
using LaundryApp.DTO.Auth;
using LaundryApp.DTO.Responses;
using LaundryApp.Services;

namespace LaundryApp.Controllers;

[ApiController]
[ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
[ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(
        AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterDto dto)
    {
        await _authService.RegisterAsync(dto);
        return Ok(new ApiResponse<object>
        {
            Success = true,
            Message = "User registered successfully"
        });
    }

    [ProducesResponseType(typeof(ApiResponse<AuthResultDto>), StatusCodes.Status200OK)]
    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginDto dto)
    {

        var result = await _authService.LoginAsync(dto);

        return Ok(new ApiResponse<AuthResultDto>
        {
            Success = true,
            Message = "User Logged in successfully",
            Data = result
        });
    }

    [ProducesResponseType(typeof(ApiResponse<TokenDto>), StatusCodes.Status200OK)]
    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken(RefreshTokenRequestDto dto)
    {
        var result = await _authService.RefreshTokenAsync(dto);

        return Ok(new ApiResponse<TokenDto>
        {
            Success = true,
            Message = "Token refreshed successfully",
            Data = result
        });
    }
}