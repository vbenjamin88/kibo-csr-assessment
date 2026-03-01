using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KiboCsr.Api.Models;

public class Order
{
    [Key]
    public string OrderId { get; set; } = string.Empty;

    [Required]
    public string CustomerName { get; set; } = string.Empty;

    [Required]
    public OrderStatus Status { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Total { get; set; }

    public string ItemsJson { get; set; } = "[]"; // JSON array of item strings
}
