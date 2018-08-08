using System.Web.Http;
using Microsoft.AspNet.OData.Builder;
using Microsoft.AspNet.OData.Extensions;
using ProductOrders.Models;

namespace ProductOrders
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {

            ODataConventionModelBuilder modelBuilder = new ODataConventionModelBuilder();
            modelBuilder.EntitySet<OrderDocument>("Order");
            // Function parameter maps with ODataRoute parameter name in controller
            var getProductConfig = modelBuilder.Function("GetPdfDocumentInBase64");
            getProductConfig.Parameter<int>("orderRecordId");
            getProductConfig.Parameter<string>("documentType");
            getProductConfig.Returns<string>();
            config.MapODataServiceRoute(routeName: "ODataRoute", routePrefix: "OrderOData", model: modelBuilder.GetEdmModel());

        }
    }
}
