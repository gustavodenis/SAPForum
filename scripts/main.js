// Wait for Apache Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

// PhoneGap is ready
function onDeviceReady() { }

function checkConnection() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.NONE] = 'No network connection';

    alert('Connection type: ' + states[networkState]);
}

var sapForumApp = function () { }

sapForumApp.prototype = function () {

    var _login = false,

    run = function () {

        var that = this;
        $('#home').on('pagebeforecreate', $.proxy(_initHome, that));
        $('#pointsDetail').on('pagebeforeshow', $.proxy(_initpointsDetail, that));
        $('#infoSession').on('pageshow', $.proxy(_initinfoSession, that));
        $('#agendaPage').on('pageshow', $.proxy(_initagendaPage, that));
        $('#luluPage').on('pageshow', $.proxy(_initluluPage, that));
        $('#lulurankPage').on('pageshow', $.proxy(_initlulurankPage, that));

        if (window.localStorage.getItem("userInfo") != null) {
            alert(window.localStorage.getItem("userInfo"));
            _login = true;
            _loadHome(window.localStorage.getItem("userInfo"));
            $.mobile.changePage('#home', { transition: 'flip' });
        }

        $('#scanQR').click(function () {
            var scanner = cordova.require("cordova/plugin/BarcodeScanner");

            scanner.scan(function (result) {
                alert(result.text);
                document.getElementById("info").innerHTML = result.text;
            }, function (error) {
                console.log("Scanning failed: ", error);
            });
        });

        $('.loginBtn').click(function () {
            if (window.localStorage.getItem("userInfo") === null) {

                fauxAjax(function () {
                    $.post("http://ec2-54-200-107-211.us-west-2.compute.amazonaws.com/odata/User", 
                        { firstname: $('#firstname').val(), lastname: $('#lastname').val(), employer: $('#employer').val(), email: $('#email').val() })
                    .done(function (data) {
                        window.localStorage.setItem("userInfo", data);
                        _loadHome(data);

                        $(this).hide();
                        _login = true;

                        $.mobile.changePage('#home', { transition: 'flip' });
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        alert("Request failed: " + textStatus + "," + errorThrown);
                    });
                }, 'autenticando...', this);
            }

            return false;
        });

        $('#savelulu').click(function () {
            fauxAjax(function () {
                $.post("http://ec2-54-200-107-211.us-west-2.compute.amazonaws.com/odata/User",
                    {
                        idStand: $('#standLuluCombo option:selected').val(),
                        question1: $('#question1').val(),
                        question2: $('#question2').val(),
                        question3: $('#question3').val(),
                        question4: $('#question4').val(),
                        question5: $('#question5').val(),
                        question6: $('#question6').val()
                    })
                .done(function (data) {
                    window.localStorage.setItem("luluOK", "true");
                    $.mobile.changePage('#lulurankPage', { transition: 'flip' });
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    alert("Request failed: " + textStatus + "," + errorThrown);
                });
            }, 'gravando registros...', this);
        });

        $('#okdisclamer').click(function () {
            window.localStorage.setItem("disclamer", "ok");
        });
    },

    _initpointsDetail = function () {
        checkConnection();
    },

    _initinfoSession = function () {
        $('#dataAgenda').text("14/02/2014");
    },

    _initHome = function () {
        if (!_login) {
            $.mobile.changePage("#logon", { transition: "flip" });
        }
    },

    _loadHome = function (userInfo)
    {
        fauxAjax(function () {
            $('#ffname').text(userInfo.firstname);
            $('#bestStand').text("Softtek");
            if (window.localStorage.getItem("disclamer") === null)
                $.mobile.changePage('#disclamer', { transition: 'flip' });
            else
                $.mobile.changePage('#home', { transition: 'flip' });
        }, 'carregando...', this);
    },

    _initagendaPage = function () {
    },

    _initluluPage = function () {
        fauxAjax(function () {
            $.getJSON("http://ec2-54-200-107-211.us-west-2.compute.amazonaws.com/odata/Stand")
            .done(function (data) {
                for (var ln in data.value) {
                    $('#standLuluCombo').append("<option value='" + ln.idStand + "'>" + ln.dsStand + "</option>");
                }
            })
            .fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                alert("Request Failed: " + err);
            });

        }, 'carregando...', this);
    },

    _initlulurankPage = function () {
        var telephoneNumber = cordova.require("cordova/plugin/telephonenumber");
        telephoneNumber.get(function (result) {
            alert(result);
        }, function () {
            console.log("error");
        });
    },

    fauxAjax = function fauxAjax(func, text, thisObj) {
        $.mobile.loading('show', { theme: 'a', textVisible: true, text: text });
        window.setTimeout(function () {
            $.mobile.loading('hide');
            func();
        }, 1000);
    };

    return {
        run: run,
    };
}();