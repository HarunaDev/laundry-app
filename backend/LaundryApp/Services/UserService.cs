using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using LaundryApp.Data;
using LaundryApp.DTO.User;
using LaundryApp.Models;
using LaundryApp.Exceptions;
using LaundryApp.Extensions;
using LaundryApp.DTO.Responses;

namespace LaundryApp.Services;

public class UserService
{
    private readonly LaundryAppDbContext _context;

    public UserService(LaundryAppDbContext context)
    {
        _context = context;
    }

    // get all users
    public async Task<(IEnumerable<UserDto> Items, PagedResponse<UserDto> Meta)> GetUsersAsync(int pageNumber, int pageSize)
    {
        var query = _context.Users
            .Where(u =>
                u.Role == UserRole.Client && !u.IsDeleted)
            .OrderBy(u => u.UserName)
            .Select(u => new UserDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email
            });

        // if (!users.Any())
        // {
        //     throw new NotFoundException("No users found.");
        // }

        return await query.ToPagedResponseAsync(pageNumber, pageSize);
    }

    // get current user
    public async Task<UserResponseDto> GetCurrentUserAsync(
    ClaimsPrincipal currentUser)
    {
        var userId =
            currentUser.FindFirstValue(ClaimTypes.NameIdentifier);

        var user = await _context.Users
            .Where(u =>
                u.Id == userId &&
                !u.IsDeleted)
            .Select(u => new UserResponseDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email
            })
            .FirstOrDefaultAsync();

        if (user is null)
        {
            throw new NotFoundException("User not found.");
        }

        return user;
    }

    // get user by Id
    public async Task<UserResponseDto> GetUserByIdAsync(string id)
    {
        var user = await _context.Users
            .Where(u => u.Id == id && u.Role == UserRole.Client && !u.IsDeleted)
            .Select(u => new UserResponseDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email
            })
            .FirstOrDefaultAsync();
        if (user is null)
        {
            throw new NotFoundException("User not found.");
        }

        return user;
    }

    // update user (only the owner can update themselves)
    public async Task<UserResponseDto> UpdateUserAsync(string id, UpdateUserDto dto, ClaimsPrincipal currentUser)
    {
        var currentUserId = currentUser.FindFirstValue(ClaimTypes.NameIdentifier);

        if (currentUserId != id)
        {
            throw new UnauthorizedAccessException("You can only update your own profile.");
        }

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && u.Role == UserRole.Client && !u.IsDeleted);

        if (user is null)
        {
            throw new NotFoundException("User not found.");
        }

        var emailExists = await _context.Users.AnyAsync(u => u.Email == dto.Email && u.Id != id && !u.IsDeleted);

        if (emailExists)
        {
            throw new ConflictException("Email already exists.");
        }

        var usernameExists = await _context.Users.AnyAsync(u => u.UserName == dto.UserName && u.Id != id && !u.IsDeleted);

        if (usernameExists)
        {
            throw new ConflictException("Username already exists.");
        }

        user.UserName = dto.UserName;
        user.Email = dto.Email;

        await _context.SaveChangesAsync();

        return new UserResponseDto
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email
        };
    }

    // soft delete client (only current user can delete account)
    public async Task DeleteCurrentUserAsync(ClaimsPrincipal currentUser)
    {
        var currentUserId = currentUser.FindFirstValue(ClaimTypes.NameIdentifier);

        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == currentUserId && u.Role == UserRole.Client && !u.IsDeleted);

        if (user is null)
        {
            throw new NotFoundException("User not found.");
        }

        user.IsDeleted = true;
        user.DeletedAt = DateTime.UtcNow;
        user.DeletedBy = currentUserId;

        await _context.SaveChangesAsync();
    }

    // soft delete client (superadmin can delete any client)
    public async Task DeleteUserAsync(
        string id,
        ClaimsPrincipal currentUser)
    {
        // var currentUserId =
        //     currentUser.FindFirstValue(ClaimTypes.NameIdentifier);

        var currentRole =
            currentUser.FindFirstValue(ClaimTypes.Role);

        if (currentRole != UserRole.SuperAdmin.ToString())
        {
            throw new UnauthorizedException(
                "Only SuperAdmin can delete users.");
        }

        var user = await _context.Users.FirstOrDefaultAsync(u =>
            u.Id == id &&
            u.Role == UserRole.Client &&
            !u.IsDeleted);

        if (user is null)
        {
            throw new NotFoundException("User not found.");
        }

        user.IsDeleted = true;
        user.DeletedAt = DateTime.UtcNow;
        user.DeletedBy = currentUser.FindFirstValue(ClaimTypes.NameIdentifier);

        await _context.SaveChangesAsync();
    }
}