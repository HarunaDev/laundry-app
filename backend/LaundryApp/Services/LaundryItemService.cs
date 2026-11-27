using LaundryApp.Data;
using LaundryApp.DTO.LaundryItem;
using LaundryApp.Exceptions;
using LaundryApp.Models;
using LaundryApp.Caching;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LaundryApp.Services;

public class LaundryItemService
{
    private readonly LaundryAppDbContext _context;
    private readonly HybridCache _cache;

    public LaundryItemService(LaundryAppDbContext context, HybridCache cache)
    {
        _context = context;
        _cache = cache;
    }

    // CREATE ITEM
    public async Task<LaundryItemResponseDto> CreateAsync(
        CreateLaundryItemDto dto)
    {
        // Ensure Laundry Service exists
        var service = await _context.LaundryServices
            .FirstOrDefaultAsync(s =>
                s.Id == dto.LaundryServiceId &&
                !s.IsDeleted);

        if (service is null)
        {
            throw new NotFoundException(
                "Laundry service not found.");
        }

        // Prevent duplicate item under same service
        var exists = await _context.LaundryItems
            .AnyAsync(i =>
                i.LaundryServiceId == dto.LaundryServiceId &&
                i.Name.ToLower() == dto.Name.ToLower() &&
                !i.IsDeleted);

        if (exists)
        {
            throw new ConflictException(
                "Laundry item already exists for this service.");
        }

        var item = new LaundryItem
        {
            Name = dto.Name,
            Price = dto.Price,
            LaundryServiceId = dto.LaundryServiceId,
            CreatedAt = DateTime.UtcNow
        };

        _context.LaundryItems.Add(item);

        await _context.SaveChangesAsync();
        await _cache.RemoveByTagAsync(CacheKeys.Items.Tag);

        return new LaundryItemResponseDto
        {
            Id = item.Id,
            Name = item.Name,
            Price = item.Price,
            LaundryServiceId = service.Id,
            LaundryServiceName = service.Name
        };
    }

    // GET ALL ITEMS
    public async Task<IEnumerable<LaundryItemDto>> GetAllAsync()
    {
        return await _cache.GetOrCreateAsync(
            CacheKeys.Items.All,
            async cancellationToken =>
            {
                return await _context.LaundryItems
                    .Where(i => !i.IsDeleted)
                    .OrderBy(i => i.Name)
                    .Select(i => new LaundryItemDto
                    {
                        Id = i.Id,
                        Name = i.Name,
                        Price = i.Price,
                        LaundryServiceId = i.LaundryServiceId,
                        LaundryServiceName = i.LaundryService.Name
                    })
                    .ToListAsync(cancellationToken);
            },
            new HybridCacheEntryOptions
            {
                Expiration = CacheKeys.Items.Expiration
            },
            tags: [CacheKeys.Items.Tag]);
    }

    // GET ITEMS BY SERVICE
    public async Task<IEnumerable<LaundryItemDto>> GetByServiceAsync(
        int serviceId)
    {
        return await _context.LaundryItems
            .Where(i =>
                i.LaundryServiceId == serviceId &&
                !i.IsDeleted)
            .Include(i => i.LaundryService)
            .OrderBy(i => i.Name)
            .Select(i => new LaundryItemDto
            {
                Id = i.Id,
                Name = i.Name,
                Price = i.Price,
                LaundryServiceId = i.LaundryServiceId,
                LaundryServiceName = i.LaundryService.Name
            })
            .ToListAsync();
    }

    // GET ITEM BY ID
    public async Task<LaundryItemResponseDto> GetByIdAsync(
        int id)
    {
        var item = await _context.LaundryItems
            .Where(i =>
                i.Id == id &&
                !i.IsDeleted)
            .Include(i => i.LaundryService)
            .Select(i => new LaundryItemResponseDto
            {
                Id = i.Id,
                Name = i.Name,
                Price = i.Price,
                LaundryServiceId = i.LaundryServiceId,
                LaundryServiceName = i.LaundryService.Name
            })
            .FirstOrDefaultAsync();

        if (item is null)
        {
            throw new NotFoundException(
                "Laundry item not found.");
        }

        return item;
    }

    // UPDATE ITEM
    public async Task<LaundryItemResponseDto> UpdateAsync(
        int id,
        UpdateLaundryItemDto dto)
    {
        var item = await _context.LaundryItems
            .FirstOrDefaultAsync(i =>
                i.Id == id &&
                !i.IsDeleted);

        if (item is null)
        {
            throw new NotFoundException(
                "Laundry item not found.");
        }

        var service = await _context.LaundryServices
            .FirstOrDefaultAsync(s =>
                s.Id == dto.LaundryServiceId &&
                !s.IsDeleted);

        if (service is null)
        {
            throw new NotFoundException(
                "Laundry service not found.");
        }

        var duplicate = await _context.LaundryItems
            .AnyAsync(i =>
                i.Id != id &&
                i.LaundryServiceId == dto.LaundryServiceId &&
                i.Name.ToLower() == dto.Name.ToLower() &&
                !i.IsDeleted);

        if (duplicate)
        {
            throw new ConflictException(
                "Laundry item already exists.");
        }

        item.Name = dto.Name;
        item.Price = dto.Price;
        item.LaundryServiceId = dto.LaundryServiceId;

        await _context.SaveChangesAsync();
        await _cache.RemoveByTagAsync(CacheKeys.Items.Tag);

        return new LaundryItemResponseDto
        {
            Id = item.Id,
            Name = item.Name,
            Price = item.Price,
            LaundryServiceId = service.Id,
            LaundryServiceName = service.Name
        };
    }

    // DELETE ITEM (SOFT DELETE)
    public async Task DeleteAsync(
        int id,
        ClaimsPrincipal currentUser)
    {
        var item = await _context.LaundryItems
            .FirstOrDefaultAsync(i =>
                i.Id == id &&
                !i.IsDeleted);

        if (item is null)
        {
            throw new NotFoundException(
                "Laundry item not found.");
        }

        item.IsDeleted = true;
        item.DeletedAt = DateTime.UtcNow;
        item.DeletedBy = currentUser.FindFirstValue(
            ClaimTypes.NameIdentifier);

        await _context.SaveChangesAsync();
        await _cache.RemoveByTagAsync(CacheKeys.Items.Tag);
    }
}