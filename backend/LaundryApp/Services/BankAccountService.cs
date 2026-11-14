
using LaundryApp.Data;
using LaundryApp.DTO.BankAccount;
using LaundryApp.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace LaundryApp.Services;

public class BankAccountService
{
    private readonly LaundryAppDbContext _context;

    public BankAccountService(LaundryAppDbContext context)
    {
        _context = context;
    }

    // =========================================
    // GET ALL BANK ACCOUNTS
    // =========================================

    // Customers receive active accounts only.
    // Administrators can optionally request inactive accounts.
    public async Task<List<BankAccountResponseDto>> GetAllAsync(
        bool includeInactive = false)
    {
        var query = _context.BankAccounts
            .AsNoTracking()
            .Where(account => !account.IsDeleted);

        if (!includeInactive)
        {
            query = query.Where(account => account.IsActive);
        }

        var accounts = await query
            .OrderBy(account => account.BankName)
            .ToListAsync();

        return accounts.Select(MapToResponse).ToList();
    }

    // =========================================
    // GET BANK ACCOUNT BY ID
    // =========================================

    public async Task<BankAccountResponseDto> GetByIdAsync(int id)
    {
        var account = await _context.BankAccounts
            .AsNoTracking()
            .FirstOrDefaultAsync(account =>
                account.Id == id && !account.IsDeleted);

        if (account is null)
        {
            throw new NotFoundException("Bank account not found.");
        }

        return MapToResponse(account);
    }

    // =========================================
    // CREATE BANK ACCOUNT
    // =========================================

    public async Task<BankAccountResponseDto> CreateAsync(
        CreateBankAccountDto dto)
    {
        var accountNumber = dto.AccountNumber.Trim();

        var accountExists = await _context.BankAccounts
            .AnyAsync(account =>
                account.AccountNumber == accountNumber);

        if (accountExists)
        {
            throw new BadRequestException(
                "A bank account with this account number already exists.");
        }

        var account = new Models.BankAccount
        {
            BankName = dto.BankName.Trim(),
            AccountName = dto.AccountName.Trim(),
            AccountNumber = accountNumber,
            IsActive = true,
            IsDeleted = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.BankAccounts.Add(account);

        await _context.SaveChangesAsync();

        return MapToResponse(account);
    }

    // =========================================
    // UPDATE BANK ACCOUNT
    // =========================================

    public async Task<BankAccountResponseDto> UpdateAsync(
        int id,
        UpdateBankAccountDto dto)
    {
        var account = await _context.BankAccounts
            .FirstOrDefaultAsync(account =>
                account.Id == id && !account.IsDeleted);

        if (account is null)
        {
            throw new NotFoundException("Bank account not found.");
        }

        var accountNumber = dto.AccountNumber.Trim();

        var duplicateAccountNumber = await _context.BankAccounts
            .AnyAsync(existing =>
                existing.Id != id &&
                existing.AccountNumber == accountNumber);

        if (duplicateAccountNumber)
        {
            throw new BadRequestException(
                "A bank account with this account number already exists.");
        }

        account.BankName = dto.BankName.Trim();
        account.AccountName = dto.AccountName.Trim();
        account.AccountNumber = accountNumber;
        account.IsActive = dto.IsActive;
        account.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToResponse(account);
    }

    // =========================================
    // DEACTIVATE BANK ACCOUNT
    // =========================================

    public async Task DeactivateAsync(int id)
    {
        var account = await _context.BankAccounts
            .FirstOrDefaultAsync(account =>
                account.Id == id && !account.IsDeleted);

        if (account is null)
        {
            throw new NotFoundException("Bank account not found.");
        }

        account.IsActive = false;
        account.IsDeleted = true;
        account.DeletedAt = DateTime.UtcNow;
        account.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
    }

    // =========================================
    // MAP ENTITY TO RESPONSE DTO
    // =========================================

    private static BankAccountResponseDto MapToResponse(
        Models.BankAccount account)
    {
        return new BankAccountResponseDto
        {
            Id = account.Id,
            BankName = account.BankName,
            AccountName = account.AccountName,
            AccountNumber = account.AccountNumber,
            IsActive = account.IsActive
        };
    }
}