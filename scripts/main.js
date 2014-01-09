// Wait for Apache Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() { }
var sapForumApp = function () { }

sapForumApp.prototype = function () {

    var _flightForCheckin = null,
    _flightForDetails = null,
    _ffNum = null,
    _customerData = null,
    _login = false,

    run = function () {
        var that = this;
        $('#home').on('pagebeforecreate', $.proxy(_initHome, that));
        $('#pointsDetail').on('pagebeforeshow', $.proxy(_initpointsDetail, that));
        $('#infoSession').on('pageshow', $.proxy(_initinfoSession, that));
        $('#agendaPage').on('pageshow', $.proxy(_initagendaPage, that));
        $('#luluPage').on('pageshow', $.proxy(_initluluPage, that));

        if (window.localStorage.getItem("idlogin") != null) {
            _login = true;
            $.mobile.changePage('#home', { transition: 'flip' });
        }

        document.getElementById('scanQR').addEventListener('click', this._scanQR, false);
    },

    _initpointsDetail = function () {
    },

    _initinfoSession = function () {
        $('#dataAgenda').text("14/02/2014");
    },

    _initHome = function () {
        if (!_login) {
            $.mobile.changePage("#logon", { transition: "flip" });
            $('.loginBtn').click(function () {
                if (window.localStorage.getItem("idlogin") === null) {
                    window.localStorage.setItem("loginType", $(this).val());
                    window.localStorage.setItem("idlogin", "blabla");
                }
                $(this).hide();
                _login = true;
                sapData.logOn($('#userName').val(), $('#pwd').val(), _handleLogOn);
                return false;
            });
        }
    },

    _initagendaPage = function () {
        var networkState = navigator.connection.type;
        alert(networkState);
    },

    _initluluPage = function () {
        var telephoneNumber = cordova.require("cordova/plugin/telephonenumber");
        telephoneNumber.get(function (result) {
            alert(result);
        }, function () {
            console.log("error");
        });
    },

    _scanQR = function () {
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
    }

    _handleLogOn = function (ff, success) {
        if (success) {
            _ffNum = ff;
            sapData.getDataforFF(_ffNum, _handleDataForFF);
        }
    },

    _handleDataForFF = function (data) {
        $('#labelpointsTotal').text("Gustavo Denis");
        $('#bestStand').text("Softtek");
        $.mobile.changePage('#home', { transition: 'flip' });
    };

    return {
        run: run,
    };
}();