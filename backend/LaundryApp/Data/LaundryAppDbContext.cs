using Microsoft.EntityFrameworkCore;
using LaundryApp.Models;
using LaundryApp.Services;

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

    public DbSet<LaundryService> LaundryServices =>
        Set<LaundryService>();

    // public DbSet<Category> Categories => Set<Category>();

    // public DbSet<Product> Products => Set<Product>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // seed a single SuperAdmin User
        // var superAdminId = Guid.NewGuid().ToString();
        // var passwordService = new PasswordService();
        // var superAdmin = new User
        // {
        //     Id = "a005670-0050-2000-0040-104020700001",
        //     UserName = "superadmin",
        //     Email = "superadmin@laundryapp.com",
        //     PasswordHash = passwordService.Hash("123456"),
        //     Role = UserRole.SuperAdmin
        // };

        // modelBuilder.Entity<User>().HasData(superAdmin);
    }
}