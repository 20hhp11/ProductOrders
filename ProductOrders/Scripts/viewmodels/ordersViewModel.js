var ordersViewModel = (function (dataService) {

    var self = this;

    self.selectedOrderIndex = ko.observable(-1);
    self.orders = ko.observableArray([]);

    self.init = function () {
        var orders = dataService.getOrders();
        self.orders(ko.utils.arrayMap(orders, function (order) {
            return new OrderIdentification(order.orderId, order.customerId, order.customerName, order.orderStatus);
        }));
    };

    self.onSelectOrder = function (index) {
        if (self.selectedOrderIndex() === index)
            self.selectedOrderIndex(-1);
        else
            self.selectedOrderIndex(index);
    };

    self.onViewAvailableDocuments = function () {
        window.location.href = "OrderDocuments.html";
    };

    self.renderedHandler = function () {
        if ($('.orders-tbl-scroll').length === 0)
            return;

        var isScollbar = $('.orders-tbl-scroll')[0].scrollHeight > $('.orders-tbl-scroll').height();
        if (isScollbar)
            $('.orders-tbl-scroll').addClass('scroll-pad');
        else
            $('.orders-tbl-scroll').removeClass('scroll-pad');
    };

    window.onresize = function () {
        self.renderedHandler();
    };

    return self;
}(dataService));