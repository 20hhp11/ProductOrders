var orderDocumentsViewModel = (function (dataService) {

    var self = this;
    self.orderDetails = ko.observable();
    self.orderDocuments = ko.observableArray([]);
    self.selectedDocumentIndex = ko.observable(-1);
    self.documentTypes = ko.observableArray([]);
    self.selectedDocumentType = ko.observable(undefined);
    self.isPdfViewerVisible = ko.observable(false);
    var defaultFileName = "document";

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

    self.onBack = function () {
        self.isPdfViewerVisible(false);
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

        //Check support for x-ms-webview(for UWP)
        if (window.MSHTMLWebViewElement) {
            if (isPrint) {
                getPdf(getPdfUrl()).done(function (result) {
                    var byteArray = getByteArray(result);
                    savePdfFile(byteArray);
                });
            }
            else {
                self.isPdfViewerVisible(true);
                getPdf(getPdfUrl()).done(function (pdfBase64) {
                    webview.addEventListener('MSWebViewNavigationCompleted', function () {
                        var operation = webview.invokeScriptAsync("handlePdf", pdfBase64, isPrint);
                        operation.start();
                    });
                    webview.navigate(new Windows.Foundation.Uri("ms-appx-web:///PdfViewer/web/viewer.html"));
                });
            }
        }
        else {
            var ie10 = (navigator.userAgent.match(/MSIE 10/i));
            if (ie10) {
                getPdf(getPdfUrl()).done(function (result) {
                    openOrSavePdf(result, defaultFileName + '.pdf');
                });
            }
            else {
                self.isPdfViewerVisible(true);
                getPdf(getPdfUrl()).done(function (pdfBase64) {
                    localStorage.setItem("pdfBase64", pdfBase64);
                    localStorage.setItem("isPrint", isPrint);

                    $('#pdfViewer').html('<embed width="100%" height="100%" src="PdfViewer/web/viewer.html" />');
                });
            }
        }
    };

    function openOrSavePdf(data, fileName) {
        var byteArray = getByteArray(data);
        var blob = new Blob([byteArray], { type: 'application/pdf' });

        if (window.navigator && window.navigator.msSaveOrOpenBlob)
            window.navigator.msSaveOrOpenBlob(blob, fileName);
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

    function getByteArray(data) {
        var byteCharacters = atob(data);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        return byteArray;
    };

    function savePdfFile(byteArray) {
        var savePicker = new Windows.Storage.Pickers.FileSavePicker();
        savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.documentsLibrary;
        savePicker.fileTypeChoices.insert("pdf", [".pdf"]);
        savePicker.suggestedFileName = defaultFileName;
        savePicker.pickSaveFileAsync().then(function (file) {
            if (file) {
                Windows.Storage.CachedFileManager.deferUpdates(file);
                Windows.Storage.FileIO.writeBytesAsync(file, byteArray).done(function () {
                    Windows.Storage.CachedFileManager.completeUpdatesAsync(file).done(function (updateStatus) {
                        //if (updateStatus === Windows.Storage.Provider.FileUpdateStatus.complete) 
                    });
                });
            }
        });
    };

    return self;
}(dataService));





 