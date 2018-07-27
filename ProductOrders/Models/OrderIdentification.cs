using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductOrders.Models
{
    public class OrderIdentification
    {
        public string OrderId { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string OrderStatus { get; set; }        
    }
}