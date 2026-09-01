using System.ComponentModel.DataAnnotations;

namespace LaundryApp.DTO.Auth;

public class AuthResultDto
{
    public string UserId { get; set; } = string.Empty;

    public string AccessToken { get; set; } = string.Empty;

    public string RefreshToken { get; set; } = string.Empty;
    // public required TokenDto Tokens { get; set; }
}

public class AuthResponseDto
{
    public string UserId { get; set; } = string.Empty;

    public string AccessToken { get; set; } = string.Empty;
}

// public class TokenDto
// {
//     public string AccessToken { get; set; } = "";
//     public string RefreshToken { get; set; } = "";
// }

public class LoginDto
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]

    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = string.Empty;
}

public class RegisterDto
{
    [Required(ErrorMessage = "Username is required")]
    [MinLength(3, ErrorMessage = "Username must be at least 3 characters")]
    public string UserName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
    public required string Password { get; set; } = string.Empty;
}

// public class RefreshTokenRequestDto
// {
//     [Required(ErrorMessage = "Refresh token is required")]
//     public required string RefreshToken { get; set; }
// }