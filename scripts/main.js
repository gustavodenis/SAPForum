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

        var idlogin = window.localStorage.getItem("idlogin");
        if (idlogin != undefined) {
            _login = true;
            $.mobile.changePage('#home', { transition: 'flip' });
        }
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
                var logType = window.localStorage.getItem("loginType");
                if (logType == undefined) {
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
    },

    _initluluPage = function () {
    },

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