var dataService = (function () {
    var exports = {};

    exports.getOrders = function () {
        return [
            {
                orderNo: 'AUF1255432',
                customer: '122220000, Janie Adams',
                status: 'Invoiced'
            },
            {
                orderNo: 'AUD4758692',
                customer: '5236522, John Doe',
                status: 'Invoiced'
            },
            {
                orderNo: 'FED896523',
                customer: '54223355, James Logan',
                status: 'Invoiced'
            },
            {
                orderNo: 'RST523652',
                customer: '8562245, Chris Wayne',
                status: 'Invoiced'
            }];
    };

    return exports;
}());