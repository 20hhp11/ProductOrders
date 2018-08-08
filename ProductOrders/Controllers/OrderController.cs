using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.OData;
using Microsoft.AspNet.OData.Routing;

namespace ProductOrders.Controllers
{
    public class OrderController : ODataController
    {
        [HttpGet]
        [ODataRoute("GetPdfDocumentInBase64()")]
        public string GetPdfDocumentInBase64(int orderRecordId, string documentType)
        {
            string pdfFile = @"Pdf/sample.pdf";
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            var basePath = System.AppContext.BaseDirectory;
            var filePath = Path.Combine(basePath, pdfFile);
            Byte[] bytes = File.ReadAllBytes(filePath);
            string file = Convert.ToBase64String(bytes);

            return file;
        }
    }
}

