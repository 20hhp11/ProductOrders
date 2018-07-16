var Order = function (orderNo, customer, status) {
    var self = this;

    self.orderNo = ko.observable(orderNo);
    self.customer = ko.observable(customer);
    self.status = ko.observable(status);

    return self;
};