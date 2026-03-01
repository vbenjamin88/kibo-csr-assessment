using Microsoft.EntityFrameworkCore;
using KiboCsr.Api.Models;

namespace KiboCsr.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Order> Orders => Set<Order>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(e =>
        {
            e.HasKey(x => x.OrderId);
            e.Property(x => x.ItemsJson).IsRequired();
        });

        // Seed data
        modelBuilder.Entity<Order>().HasData(
            new Order
            {
                OrderId = "101",
                CustomerName = "John Smith",
                Status = OrderStatus.Pending,
                Total = 149.99m,
                ItemsJson = "[\"Widget Pro\",\"USB Cable\",\"Screen Protector\"]"
            },
            new Order
            {
                OrderId = "102",
                CustomerName = "Jane Doe",
                Status = OrderStatus.Shipped,
                Total = 299.50m,
                ItemsJson = "[\"Laptop Stand\",\"Wireless Mouse\"]"
            },
            new Order
            {
                OrderId = "103",
                CustomerName = "Bob Johnson",
                Status = OrderStatus.Pending,
                Total = 45.00m,
                ItemsJson = "[\"Phone Case\"]"
            },
            new Order
            {
                OrderId = "104",
                CustomerName = "Alice Brown",
                Status = OrderStatus.Cancelled,
                Total = 89.99m,
                ItemsJson = "[\"Headphones\",\"Adapter\"]"
            },
            new Order
            {
                OrderId = "105",
                CustomerName = "Charlie Wilson",
                Status = OrderStatus.Shipped,
                Total = 520.00m,
                ItemsJson = "[\"Smart Watch\",\"Charging Dock\",\"Straps Pack\"]"
            }
        );
    }
}
