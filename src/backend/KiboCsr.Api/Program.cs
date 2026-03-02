using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using KiboCsr.Api.Data;
using KiboCsr.Api.Models;
using KiboCsr.Api.Services;

// Load .env from repo root (when running locally - Docker injects vars directly)
var dirs = new[] { Directory.GetCurrentDirectory(), AppContext.BaseDirectory };
var rels = new[] { ".env", "..\\.env", "..\\..\\.env", "..\\..\\..\\.env", "..\\..\\..\\..\\.env", "..\\..\\..\\..\\..\\.env" };
foreach (var baseDir in dirs)
{
    foreach (var rel in rels)
    {
        var path = Path.GetFullPath(Path.Combine(baseDir, rel));
        if (File.Exists(path)) { Env.Load(path); goto loaded; }
    }
}
loaded:

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddDbContext<AppDbContext>(o =>
{
    var conn = builder.Configuration.GetConnectionString("Default") ?? "Data Source=kibo.db";
    o.UseSqlite(conn);
});
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IAgentService, AgentService>();

builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
{
    p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
}));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    if (!db.Orders.Any())
    {
        db.Orders.AddRange(
            new Order { OrderId = "101", CustomerName = "John Smith", Status = OrderStatus.Pending, Total = 149.99m, ItemsJson = "[\"Widget Pro\",\"USB Cable\",\"Screen Protector\"]" },
            new Order { OrderId = "102", CustomerName = "Jane Doe", Status = OrderStatus.Shipped, Total = 299.50m, ItemsJson = "[\"Laptop Stand\",\"Wireless Mouse\"]" },
            new Order { OrderId = "103", CustomerName = "Bob Johnson", Status = OrderStatus.Pending, Total = 45.00m, ItemsJson = "[\"Phone Case\"]" },
            new Order { OrderId = "104", CustomerName = "Alice Brown", Status = OrderStatus.Cancelled, Total = 89.99m, ItemsJson = "[\"Headphones\",\"Adapter\"]" },
            new Order { OrderId = "105", CustomerName = "Charlie Wilson", Status = OrderStatus.Shipped, Total = 520.00m, ItemsJson = "[\"Smart Watch\",\"Charging Dock\",\"Straps Pack\"]" }
        );
        db.SaveChanges();
    }
}

app.UseCors();
app.MapControllers();

app.Run();
