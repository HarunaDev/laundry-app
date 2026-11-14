
namespace LaundryApp.Models;

public class BankAccount
{
    public int Id { get; set; }

    public required string BankName { get; set; }

    public required string AccountName { get; set; }

    public required string AccountNumber { get; set; }

    public bool IsActive { get; set; } = true;

    public bool IsDeleted { get; set; }

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public DateTime? DeletedAt { get; set; }
}
