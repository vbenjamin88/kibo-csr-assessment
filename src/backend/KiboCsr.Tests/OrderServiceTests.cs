using Microsoft.EntityFrameworkCore;
using KiboCsr.Api.Data;
using KiboCsr.Api.Models;
using KiboCsr.Api.Services;
using Xunit;

namespace KiboCsr.Tests;

public class OrderServiceTests
{
    private static AppDbContext CreateContext()
    {
        var opts = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var ctx = new AppDbContext(opts);
        ctx.Orders.AddRange(
            new Order { OrderId = "101", CustomerName = "John", Status = OrderStatus.Pending, Total = 100, ItemsJson = "[]" },
            new Order { OrderId = "102", CustomerName = "Jane", Status = OrderStatus.Shipped, Total = 200, ItemsJson = "[]" }
        );
        ctx.SaveChanges();
        return ctx;
    }

    [Fact]
    public async Task GetOrder_ExistingId_ReturnsOrder()
    {
        await using var ctx = CreateContext();
        var svc = new OrderService(ctx);
        var order = await svc.GetOrderAsync("101");
        Assert.NotNull(order);
        Assert.Equal("101", order.OrderId);
        Assert.Equal(OrderStatus.Pending, order.Status);
    }

    [Fact]
    public async Task GetOrder_WithHash_ReturnsOrder()
    {
        await using var ctx = CreateContext();
        var svc = new OrderService(ctx);
        var order = await svc.GetOrderAsync("#101");
        Assert.NotNull(order);
        Assert.Equal("101", order.OrderId);
    }

    [Fact]
    public async Task GetOrder_NotFound_ReturnsNull()
    {
        await using var ctx = CreateContext();
        var svc = new OrderService(ctx);
        var order = await svc.GetOrderAsync("999");
        Assert.Null(order);
    }

    [Fact]
    public async Task CancelOrder_Pending_Succeeds()
    {
        await using var ctx = CreateContext();
        var svc = new OrderService(ctx);
        var (success, msg) = await svc.CancelOrderAsync("101");
        Assert.True(success);
        Assert.Contains("successfully cancelled", msg);
        var order = await ctx.Orders.FindAsync("101");
        Assert.Equal(OrderStatus.Cancelled, order!.Status);
    }

    [Fact]
    public async Task CancelOrder_Shipped_Fails()
    {
        await using var ctx = CreateContext();
        var svc = new OrderService(ctx);
        var (success, msg) = await svc.CancelOrderAsync("102");
        Assert.False(success);
        Assert.Contains("shipped", msg);
    }

    [Fact]
    public async Task CancelOrder_NotFound_Fails()
    {
        await using var ctx = CreateContext();
        var svc = new OrderService(ctx);
        var (success, msg) = await svc.CancelOrderAsync("999");
        Assert.False(success);
        Assert.Contains("not found", msg);
    }
}
