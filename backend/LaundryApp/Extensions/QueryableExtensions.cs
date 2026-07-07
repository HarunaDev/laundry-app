using Microsoft.EntityFrameworkCore;
using LaundryApp.DTO.Responses;

namespace LaundryApp.Extensions
{
    public static class IQueryableExtensions
    {
        public static async Task<(IEnumerable<T> Items, PagedResponse<T> Meta)> ToPagedResponseAsync<T>(
            this IQueryable<T> query,
            int pageNumber,
            int pageSize)
        {
            var totalRecords = await query.CountAsync();
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var meta = new PagedResponse<T>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords
            };

            return (items, meta);
        }
    }
}
