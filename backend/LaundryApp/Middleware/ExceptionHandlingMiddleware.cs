using System.Net;
using LaundryApp.DTO.Responses;
using LaundryApp.Exceptions;

namespace LaundryApp.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(
        RequestDelegate next,
        ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);

            var response = new ErrorResponse
            {
                Success = false
            };

            switch (ex)
            {
                case ValidationException:
                    context.Response.StatusCode = StatusCodes.Status400BadRequest;
                    response.ErrorCode = "VALIDATION_ERROR";
                    response.Message = ex.Message;
                    break;

                case UnauthorizedException:
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    response.ErrorCode = "UNAUTHORIZED";
                    response.Message = ex.Message;
                    break;

                case ConflictException:
                    context.Response.StatusCode = StatusCodes.Status409Conflict;
                    response.ErrorCode = "CONFLICT";
                    response.Message = ex.Message;
                    break;

                case NotFoundException:
                    context.Response.StatusCode = StatusCodes.Status404NotFound;
                    response.ErrorCode = "NOT_FOUND";
                    response.Message = ex.Message;
                    break;

                default:
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    response.ErrorCode = "INTERNAL_SERVER_ERROR";
                    response.Message = "An unexpected error occurred.";
                    break;
            }

            // context.Response.StatusCode =
            //     (int)HttpStatusCode.InternalServerError;

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}