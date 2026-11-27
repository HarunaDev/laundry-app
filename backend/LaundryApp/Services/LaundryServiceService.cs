using LaundryApp.Data;
using LaundryApp.DTO.LaundryService;
using LaundryApp.Exceptions;
using LaundryApp.Models;
using LaundryApp.Caching;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LaundryApp.Services;

public class LaundryServiceService
{
    private readonly LaundryAppDbContext _context;
    private readonly HybridCache _cache;
    public LaundryServiceService(LaundryAppDbContext context, HybridCache cache)
    {
        _context = context;
        _cache = cache;
    }

    // create service
    public async Task<LaundryServiceResponseDto> CreateAsync(
        CreateLaundryServiceDto dto,
        ClaimsPrincipal currentUser)
    {
        var exists = await _context.LaundryServices
            .AnyAsync(s =>
                s.Name.ToLower() == dto.Name.ToLower() &&
                !s.IsDeleted);

        if (exists)
        {
            throw new ConflictException(
                "Laundry service already exists.");
        }

        var service = new LaundryService
        {
            Name = dto.Name,
            Description = dto.Description,
        };

        _context.LaundryServices.Add(service);

        await _context.SaveChangesAsync();
        await _cache.RemoveByTagAsync(CacheKeys.Services.Tag);

        return new LaundryServiceResponseDto
        {
            Id = service.Id,
            Name = service.Name,
            Description = service.Description,
            IsActive = service.IsActive
        };
    }

    // get all service

    public async Task<IEnumerable<LaundryServiceDto>> GetAllAsync()
    {
        return await _cache.GetOrCreateAsync(
            CacheKeys.Services.All,
            async cancellationToken =>
            {
                return await _context.LaundryServices
                    .Where(s =>
                        !s.IsDeleted &&
                        s.IsActive)
                    // .OrderBy(s => s.DisplayOrder)
                    .Select(s => new LaundryServiceDto
                    {
                        Id = s.Id,
                        Name = s.Name,
                        Description = s.Description,
                        IsActive = s.IsActive
                    })
                    .ToListAsync(cancellationToken);
            },
            new HybridCacheEntryOptions
            {
                Expiration = CacheKeys.Services.Expiration
            },
            tags: [CacheKeys.Services.Tag]);
    }

    // Get by Id
    public async Task<LaundryServiceResponseDto> GetByIdAsync(int id)
    {
        var service = await _context.LaundryServices
            .Where(s =>
                s.Id == id &&
                !s.IsDeleted)
            .Select(s => new LaundryServiceResponseDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description,
                IsActive = s.IsActive
            })
            .FirstOrDefaultAsync();

        if (service is null)
        {
            throw new NotFoundException(
                "Laundry service not found.");
        }

        return service;
    }

    // UPDATE SERVICE
    public async Task<LaundryServiceResponseDto> UpdateAsync(
        int id,
        UpdateLaundryServiceDto dto)
    {
        var service = await _context.LaundryServices
            .FirstOrDefaultAsync(s =>
                s.Id == id &&
                !s.IsDeleted);

        if (service is null)
        {
            throw new NotFoundException(
                "Laundry service not found.");
        }

        var duplicate = await _context.LaundryServices
            .AnyAsync(s =>
                s.Id != id &&
                s.Name.ToLower() == dto.Name.ToLower() &&
                !s.IsDeleted);

        if (duplicate)
        {
            throw new ConflictException(
                "Another service already uses this name.");
        }

        service.Name = dto.Name;
        service.Description = dto.Description;
        service.IsActive = dto.IsActive;
        service.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        await _cache.RemoveByTagAsync(CacheKeys.Services.Tag);

        return new LaundryServiceResponseDto
        {
            Id = service.Id,
            Name = service.Name,
            Description = service.Description,
            IsActive = service.IsActive
        };
    }

    // DELETE SERVICE (SOFT DELETE)
    public async Task DeleteAsync(
        int id,
        ClaimsPrincipal currentUser)
    {
        var service = await _context.LaundryServices
            .FirstOrDefaultAsync(s =>
                s.Id == id &&
                !s.IsDeleted);

        if (service is null)
        {
            throw new NotFoundException(
                "Laundry service not found.");
        }

        service.IsDeleted = true;
        service.DeletedAt = DateTime.UtcNow;
        service.DeletedBy = currentUser.FindFirst(
            System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        await _context.SaveChangesAsync();
        await _cache.RemoveByTagAsync(CacheKeys.Services.Tag);
    }
}