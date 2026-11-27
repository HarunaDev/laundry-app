namespace LaundryApp.Caching;

public static class CacheKeys
{
    // Cache key prefixes
    private const string Prefix = "laundryapp";

    // Laundry Services
    public static class Services
    {
        public const string All = $"{Prefix}:services:all";
        public const string Tag = $"{Prefix}:services";
        public static readonly TimeSpan Expiration = TimeSpan.FromMinutes(10);
    }

    // Laundry Items
    public static class Items
    {
        public const string All = $"{Prefix}:items:all";
        public const string Tag = $"{Prefix}:items";
        public static string ByService(int serviceId) => $"{Prefix}:items:service:{serviceId}";
        public static readonly TimeSpan Expiration = TimeSpan.FromMinutes(10);
    }

    // Laundry Locations
    public static class Locations
    {
        public const string All = $"{Prefix}:locations:all";
        public const string Tag = $"{Prefix}:locations";
        public static readonly TimeSpan Expiration = TimeSpan.FromMinutes(10);
    }

    // Delivery Methods
    public static class DeliveryMethods
    {
        public const string All = $"{Prefix}:delivery-methods:all";
        public const string Tag = $"{Prefix}:delivery-methods";
        public static readonly TimeSpan Expiration = TimeSpan.FromMinutes(10);
    }

    // Bank Accounts
    public static class BankAccounts
    {
        public const string Active = $"{Prefix}:bank-accounts:active";
        public const string Tag = $"{Prefix}:bank-accounts";
        public static readonly TimeSpan Expiration = TimeSpan.FromMinutes(5);
    }

    // Laundry Orderss
    public static class Orders
    {
        public const string All = $"{Prefix}:orders:all";
        public const string Tag = $"{Prefix}:orders";
        public static readonly TimeSpan Expiration = TimeSpan.FromMinutes(3);
    }

    // Dashboard
    public static class Dashboard
    {
        public const string Metrics = $"{Prefix}:dashboard:metrics";
        public const string Tag = $"{Prefix}:dashboard";
        public static readonly TimeSpan Expiration = TimeSpan.FromMinutes(2);
    }
}