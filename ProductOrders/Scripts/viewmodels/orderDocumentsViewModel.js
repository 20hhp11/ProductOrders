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

        initializePrintEvent();
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
        var isIE = /Trident/.test(navigator.userAgent) || /MSIE/.test(navigator.userAgent);
        var isEdge = /Edge/.test(navigator.userAgent);
        if (isIE) {
            var selectedDocument = self.orderDocuments()[self.selectedDocumentIndex()];
            $("#pdfDocument").remove();
            $('body').append("<embed style='position: absolute; top: 0; left: 0; z-index:-2' width='0%' height='0%' type='application/pdf' src='OrderOData/GetPdfDocument?orderRecordId=" + selectedDocument.orderRecordId() + '&documentType=' + selectedDocument.type() + "' id='pdfDocument' /> ");
            printPDF();
        }
        else if (isEdge) {
            $('#toPrint').attr('src', getPdfUrl());
        }
        else {
            var win = window.open(getPdfUrl());
            win.print();
        }
    };

    self.onPreview = function () {
        window.open(getPdfUrl());
        //window.open('ViewerJS/index.html?type=pdf#' + self.getBaseUrl() + 'OrderOData/GetPdfDocument?orderRecordId=' + selectedDocument.orderRecordId() + '&documentType=' + selectedDocument.type());
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

    var initializePrintEvent = function () {
        $('#toPrint').on('load', function () {
            window.setTimeout(function () {
                window.frames['toPrint'].print();                
            }, 1000);
        });
    };

    var getPdfUrl = function () {
        var re = new RegExp(/^.*\//);
        var baseUrl = re.exec(window.location.href);
        var selectedDocument = self.orderDocuments()[self.selectedDocumentIndex()];
        return baseUrl + 'OrderOData/GetPdfDocument?orderRecordId=' + selectedDocument.orderRecordId() + '&documentType=' + selectedDocument.type();
    };

    function printPDF() {
        //Wait until PDF is ready to print
        if (typeof document.getElementById("pdfDocument").print == 'undefined') {
            setTimeout(function () { printPDF(); }, 1000);
        } else {
            setTimeout(function () {
                var x = document.getElementById("pdfDocument");
                x.print();
            }, 1000);
        }
    }

    return self;
}(dataService));