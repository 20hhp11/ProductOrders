var ordersViewModel = (function (dataService) {

    var self = this;

    self.selectedOrderNo = ko.observable(null);
    self.orders = ko.observableArray([]);

    self.init = function () {
        var orders = dataService.getOrders();
        self.orders(ko.utils.arrayMap(orders, function (order) {
            return new Order(order.orderNo, order.customer, order.status);
        }));
    };

    self.onSelectOrder = function (order) {
        self.selectedOrderNo(order.orderNo());
    };

    return self;
}(dataService));