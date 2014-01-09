var appScan = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('scan').addEventListener('click', this.scan, false);
    },

    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    scan: function () {
        console.log('scanning');

        var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.scan(function (result) {

            alert("We got a barcode\n" +
            "Result: " + result.text + "\n" +
            "Format: " + result.format + "\n" +
            "Cancelled: " + result.cancelled);

            console.log("Scanner result: \n" +
                 "text: " + result.text + "\n" +
                 "format: " + result.format + "\n" +
                 "cancelled: " + result.cancelled + "\n");
            document.getElementById("info").innerHTML = result.text;
            console.log(result);
            /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

        }, function (error) {
            console.log("Scanning failed: ", error);
        });
    },

    encode: function () {
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");
        scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.softtek.com", function (success) {
        }, function (fail) {
            alert("encoding failed: " + fail);
        }
        );
    }

};