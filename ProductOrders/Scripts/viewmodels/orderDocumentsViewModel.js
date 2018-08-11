var orderDocumentsViewModel = (function (dataService) {

    var self = this;
    self.orderDetails = ko.observable();
    self.orderDocuments = ko.observableArray([]);
    self.selectedDocumentIndex = ko.observable(-1);
    self.documentTypes = ko.observableArray([]);
    self.selectedDocumentType = ko.observable(undefined);

    self.init = function () {
        var order = dataService.getOrderDetails();
        self.orderDetails(new OrderIdentification(order.orderId, order.customerId, order.customerName, order.orderStatus));

        //Map order documents
        var documents = dataService.getOrderDocuments();
        self.orderDocuments(ko.utils.arrayMap(documents, function (doc) {
            return new OrderDocument(doc.orderRecordId, doc.type, doc.number, doc.date, doc.amount, doc.currency, doc.extendedInformation);
        }));

        //Filter and sort unique document types
        self.documentTypes(ko.utils.arrayGetDistinctValues(ko.utils.arrayMap(self.orderDocuments(), function (doc) {
            return doc.type();
        })));
        self.documentTypes.sort();
    };

    self.filteredDocuments = ko.computed(function () {
        self.selectedDocumentIndex(-1);
        if (self.selectedDocumentType() === undefined) {
            return self.orderDocuments();
        } else {
            return ko.utils.arrayFilter(self.orderDocuments(), function (doc) {
                return doc.type() === self.selectedDocumentType();
            });
        }
    }, self);

    self.toggleExtendedInfo = function (doc) {
        doc.isExtendedInfoExpanded(!doc.isExtendedInfoExpanded());
    };

    self.onSelectDocument = function (index) {
        if (self.selectedDocumentIndex() === index)
            self.selectedDocumentIndex(-1);
        else
            self.selectedDocumentIndex(index);
    };

    self.onPrint = function () {
        handlePdf(true);
    };

    self.onPreview = function () {
        handlePdf(false);
    };

    self.renderedHandler = function () {
        if ($('.order-doc-tbl-scroll').length === 0)
            return;

        var isScollbar = $('.order-doc-tbl-scroll')[0].scrollHeight > $('.order-doc-tbl-scroll').height();
        if (isScollbar)
            $('.order-doc-tbl-scroll').addClass('scroll-pad');
        else
            $('.order-doc-tbl-scroll').removeClass('scroll-pad');
    };

    window.onresize = function () {
        self.renderedHandler();
    };

    function handlePdf(isPrint) {
        var ie10 = (navigator.userAgent.match(/MSIE 10/i));
        if (ie10) {
            getPdf(getPdfUrl()).done(function (result) {
                openOrSavePdf(result, 'document.pdf');
            });
        }
        else {
            getPdf(getPdfUrl()).done(function (pdfBase64) {
                var pdfWin;
                if (isPrint)
                    pdfWin = window.open('PdfViewer/web/viewer.html?print=1');
                else
                    pdfWin = window.open('PdfViewer/web/viewer.html');

                window.setTimeout(function () {
                    pdfWin.postMessage(pdfBase64, '*');
                }, 1000);
            });
        }
    };

    function openOrSavePdf(data, fileName) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            var byteCharacters = atob(data);
            var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var blob = new Blob([byteArray], { type: 'application/pdf' });
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        }
    };

    function getPdf(url) {
        var dfd = $.Deferred();
        $.get(url, function (response) {
            dfd.resolve(response.value);
        }).fail(function () {
            alert('Unable to load PDF');
            dfd.reject();
        });;
        return dfd.promise();
    };

    var getPdfUrl = function () {
        var re = new RegExp(/^.*\//);
        var baseUrl = re.exec(window.location.href);    //Will be different if hosted in windows universal app. Need to specify the baseurl of the OData service in that case.

        var selectedDocument = self.orderDocuments()[self.selectedDocumentIndex()];
        return baseUrl + 'OrderOData/GetPdfDocumentInBase64?orderRecordId=' + selectedDocument.orderRecordId() + '&documentType=' + selectedDocument.type();
    };

    return self;
}(dataService));