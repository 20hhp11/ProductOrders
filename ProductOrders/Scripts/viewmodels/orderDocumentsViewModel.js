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
        var selectedDocument = self.orderDocuments()[self.selectedDocumentIndex()];
        window.open('/ViewerJS/index.html?type=pdf#/OrderOData/GetPdfDocument?orderRecordId=' + selectedDocument.orderRecordId() + '&documentType=' + selectedDocument.type());
    };

    self.onPreview = function () {

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

    return self;
}(dataService));