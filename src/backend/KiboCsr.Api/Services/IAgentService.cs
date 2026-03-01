using System.Runtime.CompilerServices;

namespace KiboCsr.Api.Services;

public interface IAgentService
{
    IAsyncEnumerable<string> ProcessAsync(string userMessage, IReadOnlyList<ChatTurn>? history = null, CancellationToken ct = default);
}

public record ChatTurn(string Role, string Content);
