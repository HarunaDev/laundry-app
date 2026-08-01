using System.Security.Claims;
using LaundryApp.Data;
using LaundryApp.DTO.DeliveryMethod;
using LaundryApp.Exceptions;
using LaundryApp.Models;
using Microsoft.EntityFrameworkCore;

namespace LaundryApp.Services;

public class DeliveryMethodService
{
    private readonly LaundryAppDbContext _context;

    public DeliveryMethodService(
        LaundryAppDbContext context)
    {
        _context = context;
    }

    // CREATE DELIVERY METHOD

    public async Task<DeliveryMethodResponseDto> CreateAsync(
        CreateDeliveryMethodDto dto)
    {
        var exists = await _context.DeliveryMethods
            .AnyAsync(d =>
                d.Name.ToLower() == dto.Name.ToLower() &&
                !d.IsDeleted);

        if (exists)
        {
            throw new ConflictException(
                "Delivery method already exists.");
        }

        var deliveryMethod = new DeliveryMethod
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price
        };

        _context.DeliveryMethods.Add(deliveryMethod);

        await _context.SaveChangesAsync();

        return new DeliveryMethodResponseDto
        {
            Id = deliveryMethod.Id,
            Name = deliveryMethod.Name,
            Description = deliveryMethod.Description,
            Price = deliveryMethod.Price,
            IsActive = deliveryMethod.IsActive
        };
    }

    // GET ALL DELIVERY METHODS

    public async Task<IEnumerable<DeliveryMethodDto>> GetAllAsync()
    {
        return await _context.DeliveryMethods
            .Where(d =>
                !d.IsDeleted &&
                d.IsActive)
            .OrderBy(d => d.Name)
            .Select(d => new DeliveryMethodDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description,
                Price = d.Price,
                IsActive = d.IsActive
            })
            .ToListAsync();
    }

    // GET DELIVERY METHOD BY ID

    public async Task<DeliveryMethodResponseDto> GetByIdAsync(
        int id)
    {
        var deliveryMethod = await _context.DeliveryMethods
            .Where(d =>
                d.Id == id &&
                !d.IsDeleted)
            .Select(d => new DeliveryMethodResponseDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description,
                Price = d.Price,
                IsActive = d.IsActive
            })
            .FirstOrDefaultAsync();

        if (deliveryMethod is null)
        {
            throw new NotFoundException(
                "Delivery method not found.");
        }

        return deliveryMethod;
    }

    // UPDATE DELIVERY METHOD

    public async Task<DeliveryMethodResponseDto> UpdateAsync(
        int id,
        UpdateDeliveryMethodDto dto)
    {
        var deliveryMethod = await _context.DeliveryMethods
            .FirstOrDefaultAsync(d =>
                d.Id == id &&
                !d.IsDeleted);

        if (deliveryMethod is null)
        {
            throw new NotFoundException(
                "Delivery method not found.");
        }

        var duplicate = await _context.DeliveryMethods
            .AnyAsync(d =>
                d.Id != id &&
                d.Name.ToLower() == dto.Name.ToLower() &&
                !d.IsDeleted);

        if (duplicate)
        {
            throw new ConflictException(
                "Another delivery method already exists with this name.");
        }

        deliveryMethod.Name = dto.Name;
        deliveryMethod.Description = dto.Description;
        deliveryMethod.Price = dto.Price;
        deliveryMethod.IsActive = dto.IsActive;
        deliveryMethod.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return new DeliveryMethodResponseDto
        {
            Id = deliveryMethod.Id,
            Name = deliveryMethod.Name,
            Description = deliveryMethod.Description,
            Price = deliveryMethod.Price,
            IsActive = deliveryMethod.IsActive
        };
    }

    // SOFT DELETE DELIVERY METHOD

    public async Task DeleteAsync(
        int id,
        ClaimsPrincipal currentUser)
    {
        var deliveryMethod = await _context.DeliveryMethods
            .FirstOrDefaultAsync(d =>
                d.Id == id &&
                !d.IsDeleted);

        if (deliveryMethod is null)
        {
            throw new NotFoundException(
                "Delivery method not found.");
        }

        deliveryMethod.IsDeleted = true;
        deliveryMethod.DeletedAt = DateTime.UtcNow;
        deliveryMethod.DeletedBy = currentUser.FindFirst(
            ClaimTypes.NameIdentifier)?.Value;

        await _context.SaveChangesAsync();
    }
}