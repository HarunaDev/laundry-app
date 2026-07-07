using Ganss.Xss;

namespace LaundryApp.Security;

public class HtmlSanitizerService
{
    private readonly HtmlSanitizer _sanitizer = new();

    public string Sanitize(string input)
    {
        return _sanitizer.Sanitize(input);
    }
}