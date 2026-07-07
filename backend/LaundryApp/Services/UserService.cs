using Microsoft.EntityFrameworkCore;
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

    public async Task<(IEnumerable<UserDto> Items, PagedResponse<UserDto> Meta)> GetUsersAsync(int pageNumber, int pageSize)
    {
        var query = _context.Users
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

    public async Task<UserResponseDto> GetUserByIdAsync(string id)
    {
        var user = await _context.Users
            .Where(u => u.Id == id)
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
}