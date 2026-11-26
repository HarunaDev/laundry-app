using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;

namespace LaundryApp.Controllers;

[ApiController]
[Route("api/redis-test")]
public class RedisTestController : ControllerBase
{
    private readonly IDistributedCache _cache;

    public RedisTestController(IDistributedCache cache)
    {
        _cache = cache;
    }

    [HttpGet]
    public async Task<IActionResult> TestRedis()
    {
        const string key = "laundryapp:redis-test";
        const string value = "Redis connection from LaundryApp is working!";

        await _cache.SetStringAsync(
            key,
            value,
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
            });

        var retrievedValue = await _cache.GetStringAsync(key);

        return Ok(new
        {
            Success = retrievedValue == value,
            Message = retrievedValue
        });
    }
}