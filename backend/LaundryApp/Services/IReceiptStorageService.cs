
namespace LaundryApp.Services;

public interface IReceiptStorageService
{
    Task UploadAsync(
        Stream fileStream,
        string objectPath,
        string contentType);

    Task<Stream> DownloadAsync(string objectPath);

    Task DeleteAsync(string objectPath);

    Task<bool> ExistsAsync(string objectPath);
}
