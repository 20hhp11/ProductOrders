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

    var init = function () {
        var pdfBase64 = localStorage.getItem("pdfBase64");
        var isPrint = localStorage.getItem("isPrint");

        if (!pdfBase64) {
            document.getElementById('pageLoader').style.display = "none";
            alert("Unable to load PDF");
            return;
        }

        var pdfAsDataUri = "data:application/pdf;base64," + pdfBase64;
        var pdfAsArray = convertDataURIToBinary(pdfAsDataUri);

        window.setTimeout(function () {
            PDFViewerApplication.open(pdfAsArray);
            document.getElementById('pageLoader').style.display = "none";

            document.addEventListener('pagesloaded', function (e) {
                document.getElementById('viewerContainer').scrollTop = 0;
                if (isPrint == 'true')
                    window.print();

                localStorage.removeItem("pdfBase64");
                localStorage.removeItem("isPrint");
            }, true);
        }, 1000);
    };

    init();
})();