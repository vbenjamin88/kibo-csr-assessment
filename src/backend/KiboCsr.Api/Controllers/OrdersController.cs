using Microsoft.AspNetCore.Mvc;
using KiboCsr.Api.Services;

namespace KiboCsr.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService) => _orderService = orderService;

    [HttpGet("{orderId}")]
    public async Task<IActionResult> GetOrder(string orderId)
    {
        var order = await _orderService.GetOrderAsync(orderId);
        if (order == null) return NotFound(new { error = $"Order #{orderId} not found" });

        var items = System.Text.Json.JsonSerializer.Deserialize<string[]>(order.ItemsJson) ?? Array.Empty<string>();
        return Ok(new
        {
            orderId = order.OrderId,
            customerName = order.CustomerName,
            status = order.Status.ToString(),
            total = order.Total,
            items
        });
    }

    [HttpPost("{orderId}/cancel")]
    public async Task<IActionResult> CancelOrder(string orderId)
    {
        var (success, message) = await _orderService.CancelOrderAsync(orderId);
        if (!success) return BadRequest(new { success = false, message });
        return Ok(new { success = true, message });
    }
}
