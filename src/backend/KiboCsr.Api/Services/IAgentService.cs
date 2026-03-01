using System.Runtime.CompilerServices;

namespace KiboCsr.Api.Services;

public interface IAgentService
{
    IAsyncEnumerable<string> ProcessAsync(string userMessage, CancellationToken ct = default);
}
