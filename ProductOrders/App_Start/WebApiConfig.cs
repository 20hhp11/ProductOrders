using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.OData.Batch;
using Microsoft.AspNet.OData.Builder;
using Microsoft.AspNet.OData.Extensions;
using Microsoft.AspNet.OData.Routing;
using Microsoft.AspNet.OData.Routing.Conventions;
using Microsoft.OData.Edm;
using Newtonsoft.Json.Serialization;
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
            var getProductConfig = modelBuilder.Function("GetPdfDocument");
            getProductConfig.Parameter<int>("orderRecordId");
            getProductConfig.Parameter<string>("documentType");
            getProductConfig.Returns<HttpResponseMessage>();
            config.MapODataServiceRoute(routeName: "ODataRoute", routePrefix: "OrderOData", model: modelBuilder.GetEdmModel());

        }
    }
}
