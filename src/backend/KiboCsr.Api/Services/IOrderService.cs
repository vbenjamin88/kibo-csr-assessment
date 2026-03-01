using KiboCsr.Api.Models;

namespace KiboCsr.Api.Services;

public interface IOrderService
{
    Task<Order?> GetOrderAsync(string orderId);
    Task<(bool Success, string Message)> CancelOrderAsync(string orderId);
    Task LogCancellationAuditAsync(string orderId, string action);
}
