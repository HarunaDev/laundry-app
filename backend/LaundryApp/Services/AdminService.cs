using LaundryApp.Data;
using LaundryApp.DTO.Admin;
using LaundryApp.DTO.Auth;
using LaundryApp.DTO.Responses;
using LaundryApp.DTO.User;
using LaundryApp.Exceptions;
using LaundryApp.Extensions;
using LaundryApp.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace LaundryApp.Services;

public class AdminService
{
    private readonly LaundryAppDbContext _context;
    private readonly PasswordService _passwordService;

    public AdminService(
        LaundryAppDbContext context,
        PasswordService passwordService)
    {
        _context = context;
        _passwordService = passwordService;
    }

    // create admin
    public async Task<AdminResponseDto> CreateAdminAsync(
        CreateAdminDto dto,
        ClaimsPrincipal currentUser)
    {
        var role = currentUser.FindFirstValue(ClaimTypes.Role);

        if (role != UserRole.SuperAdmin.ToString())
        {
            throw new UnauthorizedException(
                "Only SuperAdmin can create staff admins.");
        }

        var exists = await _context.Users.AnyAsync(
            u => !u.IsDeleted && (u.Email == dto.Email ||
                 u.UserName == dto.UserName));

        if (exists)
        {
            throw new ConflictException(
                "Username or Email already exists.");
        }

        var admin = new User
        {
            UserName = dto.UserName,
            Email = dto.Email,
            PasswordHash = _passwordService.Hash(dto.Password),
            Role = UserRole.Admin
        };

        _context.Users.Add(admin);

        await _context.SaveChangesAsync();

        var response = new AdminResponseDto
        {
            Id = admin.Id,
            UserName = admin.UserName,
            Email = admin.Email
        };

        return response;
    }

    // get admins
    public async Task<(IEnumerable<AdminDto> Items, PagedResponse<AdminDto> Meta)> GetAdminsAsync(int pageNumber, int pageSize)
    {
        var query = _context.Users
            .Where(u => u.Role == UserRole.Admin && !u.IsDeleted)
            .OrderBy(u => u.UserName)
            .Select(u => new AdminDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email
            });
        return await query.ToPagedResponseAsync(pageNumber, pageSize);
    }

    public async Task<AdminResponseDto> GetAdminByIdAsync(string id)
    {
        var admin = await _context.Users
            .Where(u => u.Id == id && u.Role == UserRole.Admin && !u.IsDeleted)
            .Select(u => new AdminResponseDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email
            })
            .FirstOrDefaultAsync();

        if (admin is null)
        {
            throw new NotFoundException("Admin not found.");
        }

        return admin;
    }

    // soft delete admin
    public async Task DeleteAdminAsync(
    string id,
    ClaimsPrincipal currentUser)
    {
        var role = currentUser.FindFirstValue(ClaimTypes.Role);

        if (role != UserRole.SuperAdmin.ToString())
        {
            throw new UnauthorizedException(
                "Only SuperAdmin can delete admins.");
        }

        var admin = await _context.Users.FirstOrDefaultAsync(u =>
            u.Id == id &&
            u.Role == UserRole.Admin &&
            !u.IsDeleted);

        if (admin is null)
        {
            throw new NotFoundException("Admin not found.");
        }

        admin.IsDeleted = true;
        admin.DeletedAt = DateTime.UtcNow;
        admin.DeletedBy = currentUser.FindFirstValue(ClaimTypes.NameIdentifier);

        await _context.SaveChangesAsync();
    }
}