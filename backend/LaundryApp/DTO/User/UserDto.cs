using System.ComponentModel.DataAnnotations;
namespace LaundryApp.DTO.User;

public class UserDto
{
    public string Id { get; set; }
    public string UserName { get; set; } = "";
    public string Email { get; set; } = "";
}

public class UserRequestDto
{
    [Required(ErrorMessage = "User id is required")]
    public required string Id { get; set; }
}

public class UserResponseDto
{
    public string Id { get; set; } = "";
    public string UserName { get; set; } = "";
    public string Email { get; set; } = "";
}

public class UpdateUserDto
{
    [Required]
    [MinLength(3)]
    public string UserName { get; set; } = "";

    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";
}