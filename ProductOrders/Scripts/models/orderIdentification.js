var OrderIdentification = function (orderId, customerId, customerName, orderStatus) {
    var self = this;

    self.orderId = ko.observable(orderId);
    self.customerId = ko.observable(customerId);
    self.customerName = ko.observable(customerName);
    self.orderStatus = ko.observable(orderStatus);

    return self;
};