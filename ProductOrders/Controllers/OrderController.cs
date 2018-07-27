using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;

namespace ProductOrders.Controllers
{
    public class OrderController : ODataController
    {
        [HttpGet]
        [ODataRoute("GetPdfDocument()")]
        public HttpResponseMessage GetPdfDocument(int orderRecordId, string documentType)
        {
            string pdfFile = @"Pdf/sample.pdf";
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            var basePath = System.AppContext.BaseDirectory;
            var filePath = Path.Combine(basePath, pdfFile);
            var file = File.OpenRead(filePath);
            response.Content = new StreamContent(file);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");

            return response;
        }
    }
}

