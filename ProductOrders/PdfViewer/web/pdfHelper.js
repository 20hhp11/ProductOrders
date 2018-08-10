(function () {
    var BASE64_MARKER = ';base64,';

    function convertDataURIToBinary(dataURI) {
        var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        var base64 = dataURI.substring(base64Index);
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));

        for (var i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    };

    function getQueryStringValue(key) {
        return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    };

    function init() {
        var isPrint = getQueryStringValue('print');

        var pdfBase64 = sessionStorage.getItem('pdfBase64');
        if (!pdfBase64)
            alert("Unable to load PDF");

        sessionStorage.removeItem('pdfBase64');        

        var pdfAsDataUri = "data:application/pdf;base64," + pdfBase64;
        var pdfAsArray = convertDataURIToBinary(pdfAsDataUri);

        window.setTimeout(function () {
            PDFViewerApplication.open(pdfAsArray);
            document.getElementById('pageLoader').style.display = "none";
        }, 1000);

        if (isPrint) {
            document.addEventListener('pagesloaded', function (e) {
                window.print();
            }, true);
        }
    };

    init();
})();