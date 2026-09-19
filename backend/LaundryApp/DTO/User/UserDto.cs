using System.ComponentModel.DataAnnotations;
namespace LaundryApp.DTO.User;

public class UserDto
{
    public string Id { get; set; } = "";
    public string UserName { get; set; } = "";
    public string Email { get; set; } = "";
    public string PhoneNumber { get; set; } = "";
    public int TotalOrders { get; set; }
    public string Status { get; set; } = "Active";
    public string Role { get; set; } = "Client";
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
    public string PhoneNumber { get; set; } = "";
    public int TotalOrders { get; set; }
    public string Status { get; set; } = "Active";
    public string Role { get; set; } = "Client";
}

public class UpdateUserDto
{
    [Required]
    [MinLength(3)]
    public string UserName { get; set; } = "";

    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";
    public string PhoneNumber { get; set; } = "";

    // [Required]-
    // public string Status { get; set; } = "Active";
}

public class UpdateUserStatusDto
{
    [Required]
    public string Status { get; set; } = "Active";
}