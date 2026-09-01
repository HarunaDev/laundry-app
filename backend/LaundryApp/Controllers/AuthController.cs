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

        // return Ok(new ApiResponse<AuthResultDto>
        // {
        //     Success = true,
        //     Message = "User Logged in successfully",
        //     Data = result
        // });

        Response.Cookies.Append(
        "refreshToken",
        result.RefreshToken,
        new CookieOptions
        {
    
            HttpOnly = true,
            // IMPORTANT:
            // false for local HTTP development.
            // Change to true when using HTTPS.
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddDays(7),
            Path = "/api/auth"
        }
       );

        return Ok(new ApiResponse<AuthResponseDto>
        {
            Success = true,
            Message = "Login successful.",
            Data = new AuthResponseDto
            {
                UserId = result.UserId,
                AccessToken = result.AccessToken
            }
        });
    }

    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [HttpPost("refresh")]
    // public async Task<IActionResult> RefreshToken(RefreshTokenRequestDto dto)
    // {
    //     var result = await _authService.RefreshTokenAsync(dto);

    //     return Ok(new ApiResponse<TokenDto>
    //     {
    //         Success = true,
    //         Message = "Token refreshed successfully",
    //         Data = result
    //     });
    // }
    public async Task<IActionResult> Refresh()
{
    var refreshToken =
        Request.Cookies["refreshToken"];

    if (string.IsNullOrWhiteSpace(refreshToken))
    {
        return Unauthorized(new ErrorResponse
        {
            Success = false,
            ErrorCode = "REFRESH_TOKEN_MISSING",
            Message = "Refresh token is missing.",
            Details = []
        });
    }

    var result =
        await _authService.RefreshTokenAsync(
            refreshToken
        );

    // if (result == null)
    // {
        // Response.Cookies.Delete("refreshToken");

        // return Unauthorized(new ErrorResponse
        // {
        //     Success = false,
        //     ErrorCode = "INVALID_REFRESH_TOKEN",
        //     Message = "Invalid or expired refresh token.",
        //     Details = []
        // });
    // }

    // Replace the old cookie with the new refresh token.
    Response.Cookies.Append(
        "refreshToken",
        result.RefreshToken,
        new CookieOptions
        {
            HttpOnly = true,
            // IMPORTANT:
            // false for local HTTP development.
            // Change to true when using HTTPS.
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddDays(7),
            Path = "/api/auth"
        }
    );

    return Ok(new ApiResponse<AuthResponseDto>
    {
        Success = true,
        Message = "Token refreshed successfully.",
        Data = new AuthResponseDto
        {
            UserId = result.UserId,
            AccessToken = result.AccessToken
        }
    });
}
}