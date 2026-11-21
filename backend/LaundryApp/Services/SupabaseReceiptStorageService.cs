
using Supabase.Storage;

namespace LaundryApp.Services;

public class SupabaseReceiptStorageService : IReceiptStorageService
{
    private readonly Client _client;
    private readonly string _bucketName;

    public SupabaseReceiptStorageService(IConfiguration configuration)
    {
        var supabaseUrl = configuration["SUPABASE_URL"];
        var supabaseKey = configuration["SUPABASE_KEY"];
        _bucketName = configuration["SUPABASE_STORAGE_BUCKET"]
            ?? "payment-receipts";

        if (string.IsNullOrWhiteSpace(supabaseUrl))
        {
            throw new InvalidOperationException(
                "SUPABASE_URL is not configured.");
        }

        if (string.IsNullOrWhiteSpace(supabaseKey))
        {
            throw new InvalidOperationException(
                "SUPABASE_KEY is not configured.");
        }

        var storageUrl =
            $"{supabaseUrl.TrimEnd('/')}/storage/v1";

        var headers = new Dictionary<string, string>
        {
            ["apikey"] = supabaseKey,
            ["Authorization"] = $"Bearer {supabaseKey}"
        };

        _client = new Client(storageUrl, headers);
    }

    public async Task UploadAsync(
        Stream fileStream,
        string objectPath,
        string contentType)
    {
        await using var memoryStream = new MemoryStream();

        await fileStream.CopyToAsync(memoryStream);

        var fileOptions = new Supabase.Storage.FileOptions
        {
            ContentType = contentType,
            CacheControl = "3600",
            Upsert = false
        };

        await _client
            .From(_bucketName)
            .Upload(
                memoryStream.ToArray(),
                objectPath,
                fileOptions,
                inferContentType: false);
    }

    public async Task<Stream> DownloadAsync(string objectPath)
    {
        var bytes = await _client
            .From(_bucketName)
            .Download(objectPath, (EventHandler<float>?)null);

        return new MemoryStream(bytes);
    }

    public async Task DeleteAsync(string objectPath)
    {
        await _client
            .From(_bucketName)
            .Remove(objectPath);
    }

    public async Task<bool> ExistsAsync(string objectPath)
    {
        var fileName = Path.GetFileName(objectPath);

        var files = await _client
            .From(_bucketName)
            .List(
                Path.GetDirectoryName(objectPath)?.Replace('\\', '/') ?? "",
                new SearchOptions
                {
                    Search = fileName,
                    Limit = 1
                });

        return files?.Any(file =>
            string.Equals(
                file.Name,
                fileName,
                StringComparison.Ordinal)) == true;
    }
}
