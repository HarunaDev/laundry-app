using LaundryApp.Data;
using LaundryApp.DTO.Auth;
using LaundryApp.DTO.User;
using LaundryApp.Exceptions;
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

    public async Task<UserResponseDto> CreateAdminAsync(
        RegisterDto dto,
        ClaimsPrincipal currentUser)
    {
        var role = currentUser.FindFirstValue(ClaimTypes.Role);

        if (role != UserRole.SuperAdmin.ToString())
        {
            throw new UnauthorizedException(
                "Only SuperAdmin can create staff admins.");
        }

        var exists = await _context.Users.AnyAsync(
            u => u.Email == dto.Email ||
                 u.UserName == dto.UserName);

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

        return new UserResponseDto
        {
            Id = admin.Id,
            UserName = admin.UserName,
            Email = admin.Email
        };
    }
}