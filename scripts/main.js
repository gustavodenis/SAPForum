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
        $('#fulldata').on('pageshow', $.proxy(_initfulldataPage, that));

        if (window.localStorage.getItem("userInfo") != null) {
            _login = true;
            _loadHome(JSON.parse(window.localStorage.getItem("userInfo")));
            $.mobile.changePage('#home', { transition: 'flip' });
        }

        $('#scanQR').click(function () {
            var scanner = cordova.require("cordova/plugin/BarcodeScanner");

            scanner.scan(function (result) {
                _savePoints(result.text);
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
                        var usrdata = { idUser: data.idUser, firstname: data.firstname, lastname: data.lastname, email: data.email, employer: data.employer };
                        window.localStorage.setItem("userInfo", JSON.stringify(usrdata));
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

        $('.fulldataBtn').click(function () {
            fauxAjax(function () {
                var iidUser = JSON.parse(window.localStorage.getItem("userInfo")).idUser;
                $.ajax({
                    type: "PUT",
                    url: "http://ec2-54-200-107-211.us-west-2.compute.amazonaws.com/odata/User(" + iidUser + ")",
                    data: {
                        idUser: iidUser,
                        firstname: $('#firstname').val(),
                        lastname: $('#lastname').val(),
                        employer: $('#employer').val(),
                        email: $('#email').val(),
                        position: $('#position').val(),
                        city: $('#city').val(),
                        state: $('#state  option:selected').val(),
                        sector: $('#sector  option:selected').val(),
                        billing: $('#billing  option:selected').val(),
                        customerSAP: ($('#customerSAP').is(":checked") ? "1" : "0")
                    },
                    contentType: "application/json; charset=utf-8",
                    success: function (result) {
                        _loadHome(data);
                        $.mobile.changePage('#home', { transition: 'flip' });
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        alert(xhr.responseText);
                    }
                });
            }, 'gravando...', this);
        });

        $('#okagenda').click(function () {
            fauxAjax(function () {
                var iidUser = JSON.parse(window.localStorage.getItem("userInfo")).idUser;
                var agendadata = {
                    idUser: iidUser,
                    tel: $('#tel').val(),
                    detail: $('#detail').val(),
                    dtAgenda: $('#dtAgenda').val()
                };
                $.post("http://ec2-54-200-107-211.us-west-2.compute.amazonaws.com/odata/Agenda", agendadata)
                .done(function (data) {
                    window.localStorage.setItem("agenda", "ok");
                    $.mobile.changePage('#home', { transition: 'flip' });
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    alert("Request failed: " + textStatus + "," + errorThrown);
                });
            }, 'gravando...', this);
        });

        $('#savelulu').click(function () {
            fauxAjax(function () {
                var iidUser = JSON.parse(window.localStorage.getItem("userInfo")).idUser;
                var luludata = {
                    idStand: $('#standLuluCombo option:selected').val(),
                    idUser: iidUser,
                    question1: ($('#question1').is(":checked") ? "1" : "0"),
                    question2: ($('#question2').is(":checked") ? "1" : "0"),
                    question3: ($('#question3').is(":checked") ? "1" : "0"),
                    question4: ($('#question4').is(":checked") ? "1" : "0"),
                    question5: ($('#question5').is(":checked") ? "1" : "0"),
                    question6: ($('#question6').is(":checked") ? "1" : "0")
                };
                $.post("http://ec2-54-200-107-211.us-west-2.compute.amazonaws.com/odata/Lulu", luludata)
                .done(function (data) {
                    window.localStorage.setItem("luluOK", "ok");
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

    _initfulldataPage = function () {
        var dataUser = JSON.parse(window.localStorage.getItem("userInfo"));
        $('#firstname').val(dataUser.firstname);
        $('#lastname').val(dataUser.lastname);
        $('#employer').val(dataUser.employer);
        $('#email').val(dataUser.email);
    },

    _loadHome = function (userInfo) {
        fauxAjax(function () {
            $('#ffname').text(userInfo.firstname);
            if (window.localStorage.getItem("disclamer") === null)
                $.mobile.changePage('#disclamer', { transition: 'flip' });
            else
                $.mobile.changePage('#home', { transition: 'flip' });
        }, 'carregando...', this);
    },

    _initagendaPage = function () {

        if (window.localStorage.getItem("agenda") === null)
            $.mobile.changePage('#agendaPage', { transition: 'flip' });
        else
        {
            $.mobile.changePage('#home', { transition: 'flip' });
            alert('Obrigado por j� ter marcado uma agenda!');            
        }

        //var telephoneNumber = cordova.require("cordova/plugin/telephonenumber");
        //telephoneNumber.get(function (result) {
        //    alert(result);
        //}, function () {
        //    console.log("error");
        //});
    },

    _initluluPage = function () {
        if (window.localStorage.getItem("luluOK") === null) {
            fauxAjax(function () {
                $.getJSON("http://ec2-54-200-107-211.us-west-2.compute.amazonaws.com/odata/Stand")
                .done(function (data) {
                    for (var ln in data.value) {
                        $('#standLuluCombo').append("<option value='" + data.value[ln].idStand + "'>" + data.value[ln].dsStand + "</option>");
                    }
                })
                .fail(function (jqxhr, textStatus, error) {
                    alert("Request Failed: " + textStatus + ", " + error);
                });
            }, 'carregando...', this);
        }
        else {
            $.mobile.changePage('#home', { transition: 'flip' });
            alert('Obrigado! Mas seu voto j� foi contabilizado.');
        }
    },

    _initlulurankPage = function () {
        fauxAjax(function () {
            $.getJSON("http://ec2-54-200-107-211.us-west-2.compute.amazonaws.com/odata/Lulu")
            .done(function (data) {
                for (var ln in data.value) {
                    $('#myRankListView').append("<li id='" + data.value[ln].idStand + "'>" + data.value[ln].dsStand + "(" + data.value[ln].nrPoint + ")</li>");
                }
            })
            .fail(function (jqxhr, textStatus, error) {
                alert("Request Failed: " + textStatus + ", " + error);
            });
        }, 'carregando...', this);
    },

    _savePoints = function _savePoints(actionType) {
        if (window.localStorage.getItem(actionType) === null) {
            var iidUser = JSON.parse(window.localStorage.getItem("userInfo")).idUser;
            var postdata = { idUser: iidUser, typeAction: actionType };
            $.post("http://ec2-54-200-107-211.us-west-2.compute.amazonaws.com/odata/Point", postdata)
            .done(function (data) {
                window.localStorage.setItem(actionType, "ok");
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                alert("Save Points error: " + textStatus + "," + errorThrown);
            });
        }
    },

    _getPoints = function () {
        var iidUser = JSON.parse(window.localStorage.getItem("userInfo")).idUser;
        $.getJSON("http://ec2-54-200-107-211.us-west-2.compute.amazonaws.com/odata/Point(" + iidUser + ")")
        .done(function (data) {
            $('#labelpointsTotal').val(data.value.length);
        })
        .fail(function (jqxhr, textStatus, error) {
            alert("Get Points error: " + textStatus + ", " + error);
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