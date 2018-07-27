var OrderDocument = function (orderRecordId, type, number, date, amount, currency, extendedInformation) {
    var self = this;

    self.orderRecordId = ko.observable(orderRecordId);
    self.type = ko.observable(type);
    self.number = ko.observable(number);
    self.date = ko.observable(date);
    self.amount = ko.observable(amount);
    self.currency = ko.observable(currency);
    self.extendedInformation = ko.observable(extendedInformation);
    self.isExtendedInfoExpanded = ko.observable(false);

    return self;
};