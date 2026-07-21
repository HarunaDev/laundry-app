using System.Text.Json.Serialization;
// using StoreApp.DTOs.Product;
// using StoreApp.DTOs.User;

namespace LaundryApp.DTO.Responses
{
    // Generic metadata
    public class PagedResponse<T>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalRecords { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalRecords / PageSize);

        [JsonPropertyOrder(5)]
        public IEnumerable<T> Items { get; set; } = Enumerable.Empty<T>();
    }

    // Product-specific wrapper
    // public class ProductPagedResponse : PagedResponse<ProductDto>
    // {
    //     [JsonPropertyOrder(5)]
    //     [JsonPropertyName("products")]
    //     public IEnumerable<ProductDto> Products { get; set; } = Enumerable.Empty<ProductDto>();
    // }

    // User-specific wrapper
    // public class UserPagedResponse : PagedResponse<UserDto>
    // {
    //     [JsonPropertyOrder(5)]
    //     [JsonPropertyName("users")]
    //     public IEnumerable<UserDto> Users { get; set; } = Enumerable.Empty<UserDto>();
    // }
}
