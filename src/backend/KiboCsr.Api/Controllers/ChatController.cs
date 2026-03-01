using Microsoft.AspNetCore.Mvc;
using KiboCsr.Api.Services;
using System.Runtime.CompilerServices;

namespace KiboCsr.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IAgentService _agent;

    public ChatController(IAgentService agent) => _agent = agent;

    [HttpPost("message")]
    public async Task PostMessage([FromBody] ChatRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req?.Message))
        {
            Response.StatusCode = 400;
            await Response.WriteAsJsonAsync(new { error = "Message is required" }, ct);
            return;
        }

        Response.ContentType = "text/event-stream";
        Response.Headers.CacheControl = "no-cache";
        await Response.StartAsync(ct);

        await foreach (var chunk in _agent.ProcessAsync(req.Message, ct))
        {
            await Response.WriteAsync($"data: {System.Text.Json.JsonSerializer.Serialize(chunk)}\n\n", ct);
            await Response.Body.FlushAsync(ct);
        }
    }
}

public record ChatRequest(string Message);
