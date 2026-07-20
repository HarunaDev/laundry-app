using LaundryApp.Models;
using LaundryApp.Services;
using Microsoft.EntityFrameworkCore;

namespace LaundryApp.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var context = scope.ServiceProvider
            .GetRequiredService<LaundryAppDbContext>();

        var passwordService = scope.ServiceProvider
            .GetRequiredService<PasswordService>();

        // Create Super Admin if none exists
        if (!await context.Users.AnyAsync(u => u.Role == UserRole.SuperAdmin))
        {
            context.Users.Add(new User
            {
                UserName = "superadmin",
                Email = "superadmin@laundryapp.com",
                PasswordHash = passwordService.Hash("123456"),
                Role = UserRole.SuperAdmin,
                EmailVerified = true
            });

            await context.SaveChangesAsync();
        }
    }
}