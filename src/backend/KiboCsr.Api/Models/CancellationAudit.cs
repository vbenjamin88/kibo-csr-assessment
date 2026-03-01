using System.ComponentModel.DataAnnotations;

namespace KiboCsr.Api.Models;

public class CancellationAudit
{
    [Key]
    public int Id { get; set; }
    public string OrderId { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
