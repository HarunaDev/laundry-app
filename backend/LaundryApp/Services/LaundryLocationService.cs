using System.Security.Claims;
using LaundryApp.Data;
using LaundryApp.DTO.LaundryLocation;
using LaundryApp.Exceptions;
using LaundryApp.Models;
using Microsoft.EntityFrameworkCore;

namespace LaundryApp.Services;

public class LaundryLocationService
{
    private readonly LaundryAppDbContext _context;

    public LaundryLocationService(
        LaundryAppDbContext context)
    {
        _context = context;
    }

    // CREATE LOCATION

    public async Task<LaundryLocationResponseDto> CreateAsync(
        CreateLaundryLocationDto dto)
    {
        var exists = await _context.LaundryLocations
            .AnyAsync(l =>
                l.Name.ToLower() == dto.Name.ToLower() &&
                !l.IsDeleted);

        if (exists)
        {
            throw new ConflictException(
                "Laundry location already exists.");
        }

        var location = new LaundryLocation
        {
            Name = dto.Name,
            Address = dto.Address,
            City = dto.City,
            State = dto.State,
            Landmark = dto.Landmark,
            PhoneNumber = dto.PhoneNumber
        };

        _context.LaundryLocations.Add(location);

        await _context.SaveChangesAsync();

        return new LaundryLocationResponseDto
        {
            Id = location.Id,
            Name = location.Name,
            Address = location.Address,
            City = location.City,
            State = location.State,
            Landmark = location.Landmark,
            PhoneNumber = location.PhoneNumber,
            IsActive = location.IsActive
        };
    }

    // GET ALL LOCATIONS

    public async Task<IEnumerable<LaundryLocationDto>> GetAllAsync()
    {
        return await _context.LaundryLocations
            .Where(l =>
                !l.IsDeleted &&
                l.IsActive)
            .OrderBy(l => l.Name)
            .Select(l => new LaundryLocationDto
            {
                Id = l.Id,
                Name = l.Name,
                Address = l.Address,
                City = l.City,
                State = l.State,
                Landmark = l.Landmark,
                PhoneNumber = l.PhoneNumber,
                IsActive = l.IsActive
            })
            .ToListAsync();
    }

    // GET LOCATION BY ID

    public async Task<LaundryLocationResponseDto> GetByIdAsync(
        int id)
    {
        var location = await _context.LaundryLocations
            .Where(l =>
                l.Id == id &&
                !l.IsDeleted)
            .Select(l => new LaundryLocationResponseDto
            {
                Id = l.Id,
                Name = l.Name,
                Address = l.Address,
                City = l.City,
                State = l.State,
                Landmark = l.Landmark,
                PhoneNumber = l.PhoneNumber,
                IsActive = l.IsActive
            })
            .FirstOrDefaultAsync();

        if (location is null)
        {
            throw new NotFoundException(
                "Laundry location not found.");
        }

        return location;
    }

    // UPDATE LOCATION

    public async Task<LaundryLocationResponseDto> UpdateAsync(
        int id,
        UpdateLaundryLocationDto dto)
    {
        var location = await _context.LaundryLocations
            .FirstOrDefaultAsync(l =>
                l.Id == id &&
                !l.IsDeleted);

        if (location is null)
        {
            throw new NotFoundException(
                "Laundry location not found.");
        }

        var duplicate = await _context.LaundryLocations
            .AnyAsync(l =>
                l.Id != id &&
                l.Name.ToLower() == dto.Name.ToLower() &&
                !l.IsDeleted);

        if (duplicate)
        {
            throw new ConflictException(
                "Another laundry location already exists with this name.");
        }

        location.Name = dto.Name;
        location.Address = dto.Address;
        location.City = dto.City;
        location.State = dto.State;
        location.Landmark = dto.Landmark;
        location.PhoneNumber = dto.PhoneNumber;
        location.IsActive = dto.IsActive;
        location.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new LaundryLocationResponseDto
        {
            Id = location.Id,
            Name = location.Name,
            Address = location.Address,
            City = location.City,
            State = location.State,
            Landmark = location.Landmark,
            PhoneNumber = location.PhoneNumber,
            IsActive = location.IsActive
        };
    }

    // SOFT DELETE LOCATION

    public async Task DeleteAsync(
        int id,
        ClaimsPrincipal currentUser)
    {
        var location = await _context.LaundryLocations
            .FirstOrDefaultAsync(l =>
                l.Id == id &&
                !l.IsDeleted);

        if (location is null)
        {
            throw new NotFoundException(
                "Laundry location not found.");
        }

        location.IsDeleted = true;
        location.DeletedAt = DateTime.UtcNow;
        location.DeletedBy = currentUser.FindFirst(
            ClaimTypes.NameIdentifier)?.Value;

        await _context.SaveChangesAsync();
    }
}