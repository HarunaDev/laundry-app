using LaundryApp.Middleware;

namespace LaundryApp.Extensions;

public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseGlobalExceptionHandler(
        this IApplicationBuilder app)
    {
        return app.UseMiddleware<ExceptionHandlingMiddleware>();
    }

    public static IApplicationBuilder UseSecurityHeaders(
    this IApplicationBuilder app)
{
    return app.UseMiddleware<SecurityHeadersMiddleware>();
}
}