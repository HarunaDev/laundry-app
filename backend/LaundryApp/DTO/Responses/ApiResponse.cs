// using System.Text.RegularExpressions;

namespace LaundryApp.DTO.Responses
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
    }

    public class ErrorResponse
    {
        public bool Success { get; set; } = false;
        public string ErrorCode { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public IEnumerable<string>? Details { get; set; }
    }
}