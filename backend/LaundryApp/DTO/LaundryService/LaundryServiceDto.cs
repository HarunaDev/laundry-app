using System.ComponentModel.DataAnnotations;

namespace LaundryApp.DTO.LaundryService;

// Used when creating a laundry service

public class CreateLaundryServiceDto
{
    [Required(ErrorMessage = "Service name is required.")]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [StringLength(200)]
    public string? Description { get; set; }
}

// Used when updating a laundry service

public class UpdateLaundryServiceDto
{
    [Required(ErrorMessage = "Service name is required.")]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [StringLength(200)]
    public string? Description { get; set; }

    public bool IsActive { get; set; }
}

// Used when returning a list of services

public class LaundryServiceDto
{
    public int Id { get; set; }

    public string Name { get; set; } = "";

    public string? Description { get; set; }

    public bool IsActive { get; set; }
}

// Used when returning a single service

public class LaundryServiceResponseDto
{
    public int Id { get; set; }

    public string Name { get; set; } = "";

    public string? Description { get; set; }

    public bool IsActive { get; set; }
}