// using Microsoft.AspNetCore.Mvc;
// using Microsoft.Extensions.Caching.Distributed;

// namespace LaundryApp.Controllers;

// [ApiController]
// [Route("api/redis-test")]
// public class RedisTestController : ControllerBase
// {
//     private readonly IDistributedCache _cache;

//     public RedisTestController(IDistributedCache cache)
//     {
//         _cache = cache;
//     }

//     [HttpGet]
//     public async Task<IActionResult> TestRedis()
//     {
//         const string key = "laundryapp:redis-test";
//         const string value = "Redis connection from LaundryApp is working!";

//         await _cache.SetStringAsync(
//             key,
//             value,
//             new DistributedCacheEntryOptions
//             {
//                 AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
//             });

//         var retrievedValue = await _cache.GetStringAsync(key);

//         return Ok(new
//         {
//             Success = retrievedValue == value,
//             Message = retrievedValue
//         });
//     }
// }

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Hybrid;

namespace LaundryApp.Controllers;

[ApiController]
[Route("api/redis-test")]
public class RedisTestController : ControllerBase
{
    private readonly HybridCache _cache;

    public RedisTestController(HybridCache cache)
    {
        _cache = cache;
    }

    [HttpGet]
    public async Task<IActionResult> TestHybridCache()
    {
        const string key = "laundryapp:hybrid-cache-test";

        var options = new HybridCacheEntryOptions
        {
            Expiration = TimeSpan.FromMinutes(5)
        };

        var firstValue = await _cache.GetOrCreateAsync(
            key,
            cancellationToken =>
                ValueTask.FromResult(Guid.NewGuid().ToString()),
            options);

        var secondValue = await _cache.GetOrCreateAsync(
            key,
            cancellationToken =>
                ValueTask.FromResult(Guid.NewGuid().ToString()),
            options);
        return Ok(new
        {
            Success = firstValue == secondValue,
            FirstValue = firstValue,
            SecondValue = secondValue,
            Message = firstValue == secondValue
                ? "HybridCache is working. The cached value was reused." : "HybridCache test failed"
        });
    }
}