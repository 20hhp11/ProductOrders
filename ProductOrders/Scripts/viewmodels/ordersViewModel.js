var ordersViewModel = (function (dataService) {

    var self = this;

    self.selectedOrderId = ko.observable(null);
    self.orders = ko.observableArray([]);

    self.init = function () {
        var orders = dataService.getOrders();
        self.orders(ko.utils.arrayMap(orders, function (order) {
            return new OrderIdentification(order.orderId, order.customerId, order.customerName, order.orderStatus);
        }));
    };

    self.onSelectOrder = function (order) {
        self.selectedOrderId(order.orderId());
    };

    self.onViewAvailableDocuments = function () {
        window.location.href = "OrderDocuments.html";
    };

    return self;
}(dataService));