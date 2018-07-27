using System.ComponentModel.DataAnnotations;

namespace ProductOrders.Models
{
    public class OrderDocument
    {
        [Key]
        public int OrderRecordId { get; set; }
        public string Type { get; set; }
        public string Number { get; set; }
        public string Date { get; set; }
        public string Amount { get; set; }
        public string Currency { get; set; }
        public string ExtendedInformation { get; set; }
    }
}