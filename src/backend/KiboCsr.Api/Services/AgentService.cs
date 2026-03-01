using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using System.Text.Json;
using KiboCsr.Api.Models;

namespace KiboCsr.Api.Services;

public class AgentService : IAgentService
{
    private readonly IOrderService _orderService;
    private readonly HttpClient _http;
    private readonly string _apiKey;
    private readonly JsonSerializerOptions _jsonOpts = new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    private const string SystemPrompt = @"You are a helpful Kibo Customer Service Representative assistant. You help CSRs retrieve order details and cancel orders.
You have access to these tools:
- GetOrder(orderId): Returns order details. Use when the user asks to look up, pull up, fetch, or view an order.
- CancelOrder(orderId): Cancels a Pending order. Only Pending orders can be cancelled.

CORRECTION RULE: When the user corrects or clarifies an order number (e.g. 'Sorry, 102', 'I meant 102', '102') after a failed request (e.g. 'order not found'), continue the SAME intent they had. If they asked for STATUS and got 'not found', then said 'Sorry, 102' - they want STATUS of 102. Call GetOrder(102) and show the order. Do NOT assume they want to cancel.

ORDER DISPLAY - no duplicates: When showing order details, use ONLY a short intro line plus [ORDER:id]. The UI renders a full card. Do NOT list Status, Total, Items, or Customer Name - that duplicates the card. Example: 'Here are the details for Order #101. [ORDER:101]'

CANCELLATION - never ask for order number: When user says 'cancel it', 'cancel that', or 'cancel 102', you MUST know the order from context. If they said 'it'/'that', use the MOST RECENT order displayed or asked about. Just proceed.

Order context - IMMEDIATELY PRECEDING exchange matters: The order from the user's last question or your last display is the current one. User asked 'order status of 101', you showed Order #101. User says 'cancel it'. 'it' = 101. NOT 102 from earlier. Always use the order from the most recent exchange, never an older one.

Cancellation flow:
1. User wants to cancel → determine order from most recent in conversation. Call GetOrder. If Pending: ask 'Are you sure you want to cancel Order #<id>? (Yes/No)'. If Shipped/Cancelled: respond 'Order #<id> cannot be cancelled because it is already [status].'
2. User replies Yes/yes → IMMEDIATELY call CancelOrder.
3. User replies with a number in cancellation context → that IS the order ID. Proceed. Do NOT re-display order details.

NEVER during cancellation: ask for order number, include [ORDER:id], or re-display order details.

Keep responses concise and professional.";

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

        var messages = new List<object> { new { role = "system", content = SystemPrompt } };
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
            new { type = "function", function = new { name = "GetOrder", description = "Returns order details", parameters = new { type = "object", properties = new { orderId = new { type = "string" } }, required = new[] { "orderId" } } } },
            new { type = "function", function = new { name = "CancelOrder", description = "Cancels a Pending order", parameters = new { type = "object", properties = new { orderId = new { type = "string" } }, required = new[] { "orderId" } } } }
        };

        while (true)
        {
            var body = new { model = "gpt-4o-mini", messages, tools, tool_choice = "auto" };
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
                    var orderId = args.RootElement.GetProperty("orderId").GetString() ?? "";

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
                continue;
            }

            foreach (var ch in content) yield return ch.ToString();
            yield break;
        }
    }
}
