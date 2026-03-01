using Microsoft.EntityFrameworkCore;
using KiboCsr.Api.Data;
using KiboCsr.Api.Models;

namespace KiboCsr.Api.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _db;

    public OrderService(AppDbContext db) => _db = db;

    public async Task<Order?> GetOrderAsync(string orderId)
    {
        var id = orderId.Trim().TrimStart('#');
        return await _db.Orders.AsNoTracking().FirstOrDefaultAsync(o =>
            o.OrderId == id || o.OrderId == orderId);
    }

    public async Task<(bool Success, string Message)> CancelOrderAsync(string orderId)
    {
        var id = orderId.Trim().TrimStart('#');
        var order = await _db.Orders.FirstOrDefaultAsync(o =>
            o.OrderId == id || o.OrderId == orderId);

        if (order == null)
            return (false, $"Order #{id} not found.");

        if (order.Status == OrderStatus.Cancelled)
            return (false, $"Order #{id} is already cancelled.");

        if (order.Status == OrderStatus.Shipped)
            return (false, $"Order #{id} cannot be cancelled because it has already been shipped.");

        order.Status = OrderStatus.Cancelled;
        await _db.SaveChangesAsync();
        await LogCancellationAuditAsync(orderId, "CANCELLED");
        return (true, $"Order #{id} has been successfully cancelled.");
    }

    public Task LogCancellationAuditAsync(string orderId, string action)
    {
        // In production, write to audit table or logging service
        return Task.CompletedTask;
    }
}
