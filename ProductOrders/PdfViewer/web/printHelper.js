(function () {
    function getQueryStringValue(key) {
        return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }

    var isPrint = getQueryStringValue('print');
    {
        document.addEventListener('pagesloaded', function (e) {
            window.print();
        }, true);
    }
})();