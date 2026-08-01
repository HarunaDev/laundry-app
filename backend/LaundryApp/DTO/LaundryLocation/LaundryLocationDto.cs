using System.ComponentModel.DataAnnotations;

namespace LaundryApp.DTO.LaundryLocation;

public class LaundryLocationDto
{
    public int Id { get; set; }

    public string Name { get; set; } = "";

    public string Address { get; set; } = "";

    public string? City { get; set; }

    public string? State { get; set; }

    public string? Landmark { get; set; }

    public string? PhoneNumber { get; set; }

    public bool IsActive { get; set; }
}

public class LaundryLocationResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = "";

    public string Address { get; set; } = "";

    public string? City { get; set; }

    public string? State { get; set; }

    public string? Landmark { get; set; }

    public string? PhoneNumber { get; set; }

    public bool IsActive { get; set; }
}

public class CreateLaundryLocationDto
{
    [Required]
    public string Name { get; set; } = "";

    [Required]
    public string Address { get; set; } = "";

    public string? City { get; set; }

    public string? State { get; set; }

    public string? Landmark { get; set; }

    public string? PhoneNumber { get; set; }
}

public class UpdateLaundryLocationDto
{
    [Required]
    public string Name { get; set; } = "";

    [Required]
    public string Address { get; set; } = "";

    public string? City { get; set; }

    public string? State { get; set; }

    public string? Landmark { get; set; }

    public string? PhoneNumber { get; set; }

    public bool IsActive { get; set; }
}