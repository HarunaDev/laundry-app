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

    public DbSet<LaundryService> LaundryServices =>
        Set<LaundryService>();

    public DbSet<LaundryItem> LaundryItems =>
        Set<LaundryItem>();

    public DbSet<LaundryLocation> LaundryLocations =>
        Set<LaundryLocation>();

    public DbSet<DeliveryMethod> DeliveryMethods =>
        Set<DeliveryMethod>();

    public DbSet<LaundryOrder> LaundryOrders => Set<LaundryOrder>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<BankAccount> BankAccounts => Set<BankAccount>();

    // public DbSet<Category> Categories => Set<Category>();

    // public DbSet<Product> Products => Set<Product>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ===========================
        // USER -> ORDERS
        // ===========================

        modelBuilder.Entity<LaundryOrder>()
            .HasOne(o => o.User)
            .WithMany(u => u.LaundryOrders)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // ===========================
        // DELIVERY METHOD -> ORDERS
        // ===========================

        modelBuilder.Entity<LaundryOrder>()
            .HasOne(o => o.DeliveryMethod)
            .WithMany()
            .HasForeignKey(o => o.DeliveryMethodId)
            .OnDelete(DeleteBehavior.Restrict);

        // ===========================
        // LOCATION -> ORDERS
        // ===========================

        modelBuilder.Entity<LaundryOrder>()
            .HasOne(o => o.LaundryLocation)
            .WithMany()
            .HasForeignKey(o => o.LaundryLocationId)
            .OnDelete(DeleteBehavior.Restrict);

        // ===========================
        // ORDER -> ORDER ITEMS
        // ===========================

        modelBuilder.Entity<OrderItem>()
            .HasOne(i => i.LaundryOrder)
            .WithMany(o => o.OrderItems)
            .HasForeignKey(i => i.LaundryOrderId)
            .OnDelete(DeleteBehavior.Cascade);


        // ===========================
        // ORDER -> PAYMENT (ONE-TO-ONE)
        // ===========================

        modelBuilder.Entity<LaundryOrder>()
            .HasOne(o => o.Payment)
            .WithOne(p => p.LaundryOrder)
            .HasForeignKey<Payment>(p => p.LaundryOrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Payment>()
            .HasIndex(p => p.LaundryOrderId)
            .IsUnique();

        // ===========================
        // LAUNDRY ITEM -> ORDER ITEMS
        // ===========================

        modelBuilder.Entity<OrderItem>()
            .HasOne(i => i.LaundryItem)
            .WithMany()
            .HasForeignKey(i => i.LaundryItemId)
            .OnDelete(DeleteBehavior.Restrict);

        // Optional: Decimal precision
        modelBuilder.Entity<OrderItem>()
            .Property(i => i.UnitPrice)
            .HasPrecision(18, 2);

        modelBuilder.Entity<OrderItem>()
            .Property(i => i.TotalPrice)
            .HasPrecision(18, 2);

        modelBuilder.Entity<LaundryOrder>()
            .Property(o => o.DeliveryPrice)
            .HasPrecision(18, 2);

        modelBuilder.Entity<LaundryOrder>()
            .Property(o => o.ItemsTotal)
            .HasPrecision(18, 2);

        modelBuilder.Entity<LaundryOrder>()
            .Property(o => o.GrandTotal)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Payment>()
            .Property(p => p.PaymentMethod)
            .HasConversion<string>();

        modelBuilder.Entity<Payment>()
            .Property(p => p.PaymentStatus)
            .HasConversion<string>();

        // ===========================
        // BANK ACCOUNT
        // ===========================

        modelBuilder.Entity<BankAccount>()
            .HasIndex(b => b.AccountNumber)
            .IsUnique();
    }
}