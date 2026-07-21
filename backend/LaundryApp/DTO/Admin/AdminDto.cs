using System.ComponentModel.DataAnnotations;

namespace LaundryApp.DTO.Admin;

public class AdminDto
{
    public string Id { get; set; } = "";

    public string UserName { get; set; } = "";

    public string Email { get; set; } = "";
}

public class CreateAdminDto
{
    [Required]
    [MinLength(3)]
    public string UserName { get; set; } = "";

    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = "";
}

public class AdminResponseDto
{
    public string Id { get; set; } = "";

    public string UserName { get; set; } = "";

    public string Email { get; set; } = "";
}