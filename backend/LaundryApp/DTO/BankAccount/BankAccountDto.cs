using System.ComponentModel.DataAnnotations;
namespace LaundryApp.DTO.BankAccount;

public class CreateBankAccountDto
{
    [Required]
    [MaxLength(100)]
    public string BankName { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string AccountName { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^\d{10}$",
        ErrorMessage = "Account number must contain exactly 10 digits.")]
    public string AccountNumber { get; set; } = string.Empty;
}

public class UpdateBankAccountDto
{
    [Required]
    [MaxLength(100)]
    public string BankName { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string AccountName { get; set; } = string.Empty;

    [Required]
    [RegularExpression(@"^\d{10}$",
        ErrorMessage = "Account number must contain exactly 10 digits.")]
    public string AccountNumber { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}

public class BankAccountResponseDto
{
    public int Id { get; set; }

    public string BankName { get; set; } = string.Empty;

    public string AccountName { get; set; } = string.Empty;

    public string AccountNumber { get; set; } = string.Empty;

    public bool IsActive { get; set; }
}