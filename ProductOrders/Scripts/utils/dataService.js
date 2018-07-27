var dataService = (function () {
    var exports = {};

    exports.getOrders = function () {
        return [
            {
                orderId: 'AUF1255432',
                customerId: '122220000',
                customerName: 'Janie Adams',
                orderStatus: 'Invoiced'
            },
            {
                orderId: 'AUD4758692',
                customerId: '5236522',
                customerName: 'John Doe',
                orderStatus: 'Invoiced'
            },
            {
                orderId: 'FED896523',
                customerId: '54223355',
                customerName: 'James Logan',
                orderStatus: 'Invoiced'
            },
            {
                orderId: 'RST523652',
                customerId: '8562245',
                customerName: 'Chris Wayne',
                orderStatus: 'Invoiced'
            }];
    };

    exports.getOrderDetails = function () {
        return {
            orderId: 'FED896523',
            customerId: '54223355',
            customerName: 'James Logan',
            orderStatus: 'Invoiced'
        }
    };

    exports.getOrderDocuments = function () {
        return [
            {
                orderRecordId: 1,
                type: "Confirmation",
                number: 1002,
                date: "25/03/2018",
                amount: 140,
                currency: "EUR",
                extendedInformation: null
            },
            {
                orderRecordId: 2,
                type: "PickingList",
                number: "1001",
                date: "14/06/2018",
                amount: "280",
                currency: "USD",
                extendedInformation: "Delivery: by track, home address USA, New World. Discount 20%"
            },
            {
                orderRecordId: 3,
                type: "PackingSlip",
                number: "1003",
                date: "8/01/2018",
                amount: "340",
                currency: "EUR",
                extendedInformation: null
            },
            {
                orderRecordId: 4,
                type: "Invoice",
                number: "1006",
                date: "27/04/2018",
                amount: "40",
                currency: "EUR",
                extendedInformation: null
            },
            {
                orderRecordId: 5,
                type: "PackingSlip",
                number: "1007",
                date: "22/02/2018",
                amount: "20",
                currency: "USD",
                extendedInformation: "Delivery: by track, home address USA, New World. Discount 20%"
            },
            {
                orderRecordId: 6,
                type: "PickingList",
                number: "1004",
                date: "5/01/2018",
                amount: "320",
                currency: "USD",
                extendedInformation: null
            },
            {
                orderRecordId: 7,
                type: "Confirmation",
                number: "1009",
                date: "14/11/2018",
                amount: "650",
                currency: "EUR",
                extendedInformation: null
            },
            {
                orderRecordId: 8,
                type: "Invoice",
                number: "1008",
                date: "5/06/2018",
                amount: "870",
                currency: "EUR",
                extendedInformation: "Delivery: by track, home address USA, New World. Discount 20%"
            }
        ];
    };
  
    return exports;
}());