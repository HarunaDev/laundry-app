using Microsoft.EntityFrameworkCore;
using LaundryApp.Models;

namespace LaundryApp.Data;

public class LaundryAppDbContext : DbContext
{
    public LaundryAppDbContext(
        DbContextOptions<LaundryAppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    public DbSet<RefreshToken> RefreshTokens =>
        Set<RefreshToken>();

    // public DbSet<Category> Categories => Set<Category>();

    // public DbSet<Product> Products => Set<Product>();
}