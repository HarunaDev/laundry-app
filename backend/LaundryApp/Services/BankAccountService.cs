
using LaundryApp.Data;
using LaundryApp.DTO.BankAccount;
using LaundryApp.Exceptions;
using LaundryApp.Caching;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.EntityFrameworkCore;

namespace LaundryApp.Services;

public class BankAccountService
{
    private readonly LaundryAppDbContext _context;
    private readonly HybridCache _cache;

    public BankAccountService(LaundryAppDbContext context, HybridCache cache)
    {
        _context = context;
        _cache = cache;
    }

    // =========================================
    // GET ALL BANK ACCOUNTS
    // =========================================

    // Customers receive active accounts only.
    // Administrators can optionally request inactive accounts.
    // =========================================
    // GET ALL BANK ACCOUNTS
    // =========================================

    // Customers receive active accounts only.
    // Administrators can optionally request inactive accounts.
    public async Task<List<BankAccountResponseDto>> GetAllAsync(
        bool includeInactive = false)
    {
        // Cache only the active accounts list.
        if (!includeInactive)
        {
            return await _cache.GetOrCreateAsync(
                CacheKeys.BankAccounts.Active,
                async cancellationToken =>
                {
                    var accounts = await _context.BankAccounts
                        .AsNoTracking()
                        .Where(account =>
                            !account.IsDeleted &&
                            account.IsActive)
                        .OrderBy(account => account.BankName)
                        .ToListAsync(cancellationToken);

                    return accounts
                        .Select(MapToResponse)
                        .ToList();
                },
                new HybridCacheEntryOptions
                {
                    Expiration = CacheKeys.BankAccounts.Expiration
                },
                tags: [CacheKeys.BankAccounts.Tag]);
        }

        // Admin requests that include inactive accounts
        // bypass the cache.
        var inactiveInclusiveAccounts = await _context.BankAccounts
            .AsNoTracking()
            .Where(account => !account.IsDeleted)
            .OrderBy(account => account.BankName)
            .ToListAsync();

        return inactiveInclusiveAccounts
            .Select(MapToResponse)
            .ToList();
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
        await _cache.RemoveByTagAsync(CacheKeys.BankAccounts.Tag);

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
        await _cache.RemoveByTagAsync(CacheKeys.BankAccounts.Tag);

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
        await _cache.RemoveByTagAsync(CacheKeys.BankAccounts.Tag);
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