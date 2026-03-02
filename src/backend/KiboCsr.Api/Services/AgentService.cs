using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Text.RegularExpressions;
using KiboCsr.Api.Models;

namespace KiboCsr.Api.Services;

public class AgentService : IAgentService
{
    private static readonly Regex OrderRefRegex = new(@"\[ORDER:(\d+)\]", RegexOptions.Compiled);
    private static readonly Regex HasExplicitOrderNumber = new(@"\d+", RegexOptions.Compiled);
    private readonly IOrderService _orderService;
    private readonly HttpClient _http;
    private readonly string _apiKey;
    private readonly JsonSerializerOptions _jsonOpts = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    private const string SystemPrompt = @"You are a helpful Kibo Customer Service Representative assistant. You help CSRs retrieve order details and cancel orders.

ORDER RESOLUTION - Two cases only:
1) User provides specific order number (e.g. 'cancel 102', 'status of 101') → Use that number if it exists.
2) User does NOT provide a number (e.g. 'cancel it', 'cancel that', 'yes') → Use the LATEST order from previous chat. The system will inject which order that is when applicable.

CRITICAL - STATUS/DETAILS vs CANCELLATION:
- User says ""status"", ""details"", ""look up"", ""show"", ""order status of X"" → LOOKUP ONLY. Call GetOrder and display with [ORDER:id]. NEVER call CancelOrder. NEVER say ""cannot be cancelled"".
- User says ""cancel"", ""cancel it"", ""cancel X"" → Cancellation flow. Call GetOrder first, then CancelOrder if Pending.
When the system injects 'RESOLVED_ORDER: X', you MUST use orderId X. Call GetOrder immediately - do NOT ask the user for the order number.

You have access to these tools:
- GetOrder(orderId): Returns order details. Use when the user asks to look up an order, OR when processing 'cancel it' - use the resolved orderId.
- CancelOrder(orderId): Cancels a Pending order.

When user provides a number: Use it directly. When user does not (e.g. 'cancel it', 'yes'): Use RESOLVED_ORDER if provided.

ORDER DISPLAY: When showing order for lookup, respond ONLY: 'Here are the details for Order #X. [ORDER:X]' - no extra text. [ORDER:id] renders the card.

Cancellation: Call GetOrder first. If Pending, ask for confirmation. If Shipped/Cancelled, say 'Order #X cannot be cancelled because it is already [status].' Never substitute a different order.

Keep responses concise.";

    private static string? GetLastOrderIdFromHistory(IReadOnlyList<ChatTurn> history)
    {
        string? last = null;
        foreach (var turn in history)
        {
            if (turn.Role != "assistant") continue;
            foreach (Match m in OrderRefRegex.Matches(turn.Content))
                last = m.Groups[1].Value;
        }
        return last;
    }

    public AgentService(IOrderService orderService, IHttpClientFactory httpFactory, IConfiguration config)
    {
        _orderService = orderService;
        _http = httpFactory.CreateClient();
        _apiKey = (config["LLM_API_KEY"] ?? config["OpenAI:ApiKey"] ?? "").Trim();
    }

    public async IAsyncEnumerable<string> ProcessAsync(string userMessage, IReadOnlyList<ChatTurn>? history = null, [EnumeratorCancellation] CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(_apiKey))
        {
            yield return "⚠️ Setup required: The LLM API key is not configured. To enable chat, set the LLM_API_KEY environment variable with your OpenAI API key and restart the backend server. See README or SETUP.md for instructions.";
            yield break;
        }

        var systemContent = SystemPrompt;
        string? resolvedOrderId = null;
        var forceGetOrder = false;

        // When user doesn't specify order number, resolve from last [ORDER:id] in history
        if (history != null && history.Count > 0 && !HasExplicitOrderNumber.IsMatch(userMessage))
        {
            var lastOrderId = GetLastOrderIdFromHistory(history);
            var normalized = userMessage.Replace("canel", "cancel", StringComparison.OrdinalIgnoreCase)
                .Replace("cancle", "cancel", StringComparison.OrdinalIgnoreCase);
            var impliesCancel = normalized.Contains("cancel", StringComparison.OrdinalIgnoreCase)
                || Regex.IsMatch(userMessage.Trim(), @"^(yes|yeah|ok|okay|go\s+ahead|do\s+it)\s*[.!]?$", RegexOptions.IgnoreCase);
            var impliesLookup = userMessage.Contains("detail", StringComparison.OrdinalIgnoreCase)
                || userMessage.Contains("status", StringComparison.OrdinalIgnoreCase)
                || userMessage.Contains("show", StringComparison.OrdinalIgnoreCase)
                || userMessage.Contains("look up", StringComparison.OrdinalIgnoreCase)
                || userMessage.Contains("provide", StringComparison.OrdinalIgnoreCase);
            if (lastOrderId != null && (impliesCancel || impliesLookup))
            {
                resolvedOrderId = lastOrderId;
                forceGetOrder = impliesCancel;
                systemContent += $"\n\nRESOLVED_ORDER: {lastOrderId} — The user did not specify an order. Use orderId \"{lastOrderId}\" for GetOrder. {(impliesCancel ? "Call GetOrder immediately - do NOT ask for the order number." : "Display the order with [ORDER:id].")}";
            }
        }

        var messages = new List<object> { new { role = "system", content = systemContent } };
        if (history != null && history.Count > 0)
        {
            foreach (var turn in history.TakeLast(20))
            {
                var role = turn.Role == "user" ? "user" : "assistant";
                messages.Add(new { role, content = turn.Content });
            }
        }
        messages.Add(new { role = "user", content = userMessage });

        var tools = new[]
        {
            new { type = "function", function = new { name = "GetOrder", description = "Returns order details. When user says 'cancel it', use the order ID from the most recent order you displayed in the conversation.", parameters = new { type = "object", properties = new { orderId = new { type = "string", description = "Order ID (e.g. 101, 102). Use the order from your last display when user said 'cancel it'." } }, required = new[] { "orderId" } } } },
            new { type = "function", function = new { name = "CancelOrder", description = "Cancels a Pending order. Use order ID from conversation context when user said 'cancel it'.", parameters = new { type = "object", properties = new { orderId = new { type = "string", description = "Order ID to cancel" } }, required = new[] { "orderId" } } } }
        };

        var toolChoice = forceGetOrder ? (object)new { type = "function", function = new { name = "GetOrder" } } : "auto";

        while (true)
        {
            var body = new { model = "gpt-4o-mini", messages, tools, tool_choice = toolChoice };
            using var req = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions");
            req.Headers.Add("Authorization", "Bearer " + _apiKey);
            req.Content = JsonContent.Create(body);

            using var res = await _http.SendAsync(req, ct);
            res.EnsureSuccessStatusCode();
            var json = await res.Content.ReadFromJsonAsync<JsonElement>(ct);
            var choices = json.GetProperty("choices");
            if (choices.GetArrayLength() == 0) yield break;

            var msg = choices[0].GetProperty("message");
            var content = msg.TryGetProperty("content", out var c) ? c.GetString() ?? "" : "";

            if (msg.TryGetProperty("tool_calls", out var toolCalls) && toolCalls.GetArrayLength() > 0)
            {
                foreach (var tc in toolCalls.EnumerateArray())
                {
                    var fn = tc.GetProperty("function");
                    var name = fn.GetProperty("name").GetString() ?? "";
                    var args = JsonDocument.Parse(fn.GetProperty("arguments").GetString() ?? "{}");
                    var orderId = resolvedOrderId ?? args.RootElement.GetProperty("orderId").GetString() ?? "";

                    string toolResult;
                    if (name == "GetOrder")
                    {
                        var order = await _orderService.GetOrderAsync(orderId);
                        toolResult = order != null
                            ? JsonSerializer.Serialize(new { orderId = order.OrderId, customerName = order.CustomerName, status = order.Status.ToString(), total = order.Total, items = JsonSerializer.Deserialize<string[]>(order.ItemsJson) ?? Array.Empty<string>() }, _jsonOpts)
                            : JsonSerializer.Serialize(new { error = $"Order #{orderId} not found" }, _jsonOpts);
                    }
                    else
                    {
                        var (success, message) = await _orderService.CancelOrderAsync(orderId);
                        toolResult = JsonSerializer.Serialize(new { success, message }, _jsonOpts);
                    }

                    messages.Add(new { role = "assistant", content = (string?)null, tool_calls = new[] { new { id = tc.GetProperty("id").GetString(), type = "function", function = new { name, arguments = fn.GetProperty("arguments").GetString() } } } });
                    messages.Add(new { role = "tool", tool_call_id = tc.GetProperty("id").GetString(), content = toolResult });
                }
                toolChoice = "auto";
                continue;
            }

            foreach (var ch in content) yield return ch.ToString();
            yield break;
        }
    }
}
