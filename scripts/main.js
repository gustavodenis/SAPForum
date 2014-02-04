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

function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

var sapForumApp = function () { }

sapForumApp.prototype = function () {

    var userPoints = {};
    var erro = '';
    var _login = false,

    run = function () {

        var that = this;
        $('#home').on('pagebeforecreate', $.proxy(_initHome, that));
        $('#pointsDetail').on('pageshow', $.proxy(_initpointsDetail, that));
        $('#infoSession').on('pageshow', $.proxy(_initinfoSession, that));
        $('#agendaPage').on('pageshow', $.proxy(_initagendaPage, that));
        $('#luluPage').on('pageshow', $.proxy(_initluluPage, that));
        $('#lulurankPage').on('pageshow', $.proxy(_initlulurankPage, that));
        $('#fulldataPage').on('pageshow', $.proxy(_initfulldataPage, that));

        if (window.localStorage.getItem("userInfo") != null) {
            _login = true;
            _loadHome(JSON.parse(window.localStorage.getItem("userInfo")));
            $.mobile.changePage('#home', { transition: 'flip' });
        }

        $('#scanQR').click(function () {
            var scanner = cordova.require("cordova/plugin/BarcodeScanner");

            scanner.scan(function (result) {
                _savePoints(result.text);
            }, function (error) {
                console.log("Scanning failed: ", error);
            });
        });

        $('.loginBtn').click(function () {
            if (window.localStorage.getItem("userInfo") === null) {

                erro = '';
                if ($('#firstname').val() == '')
                    erro += '- Primeiro Nome\n';
                if ($('#lastname').val() == '')
                    erro += '- Último Nome\n';
                if ($('#employer').val() == '')
                    erro += '- Empresa\n';
                if ($('#email').val() == '')
                    erro += '- Email';
                //if (IsEmail($('#email').val()))
                //    erro += '- Email inválido\n';

                if (erro.length > 0) {
                    alert('Erros encontrados: ' + erro);
                }
                else {

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
            }

            return false;
        });

        $('.fulldataBtn').click(function () {
            erro = '';
            if ($('#tfirstname').val() == '')
                erro += '- Primeiro Nome\n';
            if ($('#tlastname').val() == '')
                erro += '- Último Nome\n';
            if ($('#temployer').val() == '')
                erro += '- Empresa\n';
            if ($('#temail').val() == '')
                erro += '- Email\n';
            //if (IsEmail($('#temail').val()))
            //    erro += '- Email inválido\n';
            if ($('#position').val() == '')
                erro += '- Cargo\n';
            if ($('#city').val() == '')
                erro += '- Cidade\n';
            if ($('#state option:selected').val() == '0')
                erro += '- Estado\n';
            if ($('#sector option:selected').val() == '0')
                erro += '- Setor\n';
            if ($('#billing option:selected').val() == '0')
                erro += '- Faturamento';

            if (erro.length > 0) {
                alert('Erros encontrados: ' + erro);
            }
            else {
                fauxAjax(function () {
                    var iidUser = JSON.parse(window.localStorage.getItem("userInfo")).idUser;
                    var dataUser = {
                        idUser: iidUser,
                        firstname: $('#tfirstname').val(),
                        lastname: $('#tlastname').val(),
                        employer: $('#temployer').val(),
                        email: $('#temail').val(),
                        position: $('#position').val(),
                        city: $('#city').val(),
                        state: $('#state  option:selected').val(),
                        sector: $('#sector  option:selected').val(),
                        billing: $('#billing  option:selected').val(),
                        customerSAP: ($('#customerSAP').is(":checked") ? "1" : "0")
                    }
                    $.post("http://ec2-54-200-107-211.us-west-2.compute.amazonaws.com/odata/User", dataUser)
                     .done(function (data) {
                         _loadHome(data);
                         $.mobile.changePage('#home', { transition: 'flip' });
                     })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        alert("Request failed: " + textStatus + "," + errorThrown);
                    });
                }, 'gravando...', this);
            }
        });

        $('#okagenda').click(function () {
            erro = '';
            if ($('#tel').val() == '')
                erro += '- Telefone\n';
            if ($('#detail').val() == '')
                erro += '- Necessidade\n';
            if ($('#dtAgenda').val() == '')
                erro += '- Data\n';

            if (erro.length > 0) {
                alert('Erros encontrados: ' + erro);
            }
            else {
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
            }
        });

        $('#savelulu').click(function () {
            erro = '';
            if ($('#standLuluCombo option:selected').val() == '0')
                erro += '- Stand\n';

            if (erro.length > 0) {
                alert('Erros encontrados: ' + erro);
            }
            else {
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
                    $.post("http://ec2-54-200-107-211.us-west-2.compute.amazonaws.com/api/Lulu", luludata)
                    .done(function (data) {
                        window.localStorage.setItem("luluOK", "ok");
                        $.mobile.changePage('#lulurankPage', { transition: 'flip' });
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        alert("Request failed: " + textStatus + "," + errorThrown);
                    });
                }, 'gravando registros...', this);
            }
        });

        $('#okdisclamer').click(function () {
            if ($('#notDisclamer').is(":checked"))
                window.localStorage.setItem("disclamer", "ok");
        });
    },

    _initpointsDetail = function () {
        $('#pointsDetail-cadastro, #pointsDetail-completo, #pointsDetail-infosession, #pointsDetail-stand, #pointsDetail-5info').text('');
        $('#pointsDetail-lulu, #pointsDetail-agenda, #pointsDetail-demo, #pointsDetail-totalpoints').text('');

        fauxAjax(function () {
            var iidUser = JSON.parse(window.localStorage.getItem("userInfo")).idUser;
            $.getJSON("http://ec2-54-200-107-211.us-west-2.compute.amazonaws.com/odata/Point(" + iidUser + ")")
            .done(function (data) {
                var cadastro = 0,
                    completo = 0,
                    infosession = 0,
                    stand = 0,
                    fiveinfo = 0,
                    lulu = 0,
                    agenda = 0,
                    demo = 0,
                    total = 0;

                for (var i in data.value) {
                    switch (data.value[i].typeAction) {
                        case 'Cadastro':
                            cadastro = 5;
                            total = total + 5;
                            break;
                        case 'Dados Completo':
                            completo = 10;
                            total = total + 10;
                            break;
                        case 'InfoSession':
                            infosession = 15;
                            total = total + 15;
                            break;
                        case 'Stand':
                            stand = 10;
                            total = total + 10;
                            break;
                        case 'FirstInfoSession':
                            fiveinfo = 25;
                            total = total + 25;
                            break;
                        case 'Quiz':
                            lulu += 15;
                            total = total + 15;
                            break;
                        case 'Agendamento de Visita':
                            agenda = 25;
                            total = total + 25;
                            break;
                        case 'Demo':
                            demo = 15;
                            total = total + 15;
                            break;
                    }
                }

                $('#pointsDetail-cadastro').text(cadastro);
                $('#pointsDetail-completo').text(completo);
                $('#pointsDetail-infosession').text(infosession);
                $('#pointsDetail-stand').text(stand);
                $('#pointsDetail-5info').text(fiveinfo);
                $('#pointsDetail-lulu').text(lulu);
                $('#pointsDetail-agenda').text(agenda);
                $('#pointsDetail-demo').text(demo);
                $('#pointsDetail-totalpoints').text(total);
            })
            .fail(function (jqxhr, textStatus, error) {
                alert("Get Points error: " + textStatus + ", " + error);
            });
        }, 'carregando...', this);
    },

    _initinfoSession = function () {
        $('#dataAgenda').text("14/02/2014 08:00:00");
    },

    _initHome = function () {
        if (!_login) {
            $.mobile.changePage("#logon", { transition: "flip" });
        }
    },

    _initfulldataPage = function () {
        var dataUser = JSON.parse(window.localStorage.getItem("userInfo"));
        $('#tfirstname').val(dataUser.firstname);
        $('#tlastname').val(dataUser.lastname);
        $('#temployer').val(dataUser.employer);
        $('#temail').val(dataUser.email);
        $('#position').val('');
        $('#city').val('');
        $('#state').val('0');
        $('#sector').val('0');
        $('#billing').val('0');
    },

    _loadHome = function (userInfo) {
        fauxAjax(function () {
            if (window.localStorage.getItem("disclamer") === null)
                $.mobile.changePage('#disclamer', { transition: 'flip' });
            else
                $.mobile.changePage('#home', { transition: 'flip' });
        }, 'carregando...', this);
    },

    _initagendaPage = function () {

        if (window.localStorage.getItem("agenda") === null)
            $.mobile.changePage('#agendaPage', { transition: 'flip' });
        else {
            $.mobile.changePage('#home', { transition: 'flip' });
            alert('Obrigado por já ter marcado uma agenda!');
        }
    },

    _initluluPage = function () {
        if (window.localStorage.getItem("luluOK") === null) {
            _LoadLuluCombo;
        }
        else {
            if (confirm('Deseja avaliar outro stand?'))
                _LoadLuluCombo;
            else
                $.mobile.changePage('#lulurankPage', { transition: 'flip' });
        }
    },

    _LoadLuluCombo = function () {
        $('#standLuluCombo').empty();
        $('#standLuluCombo').append("<option value='0' selected='selected'>Selecione...</option>");
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
    },

    _initlulurankPage = function () {
        fauxAjax(function () {
            $.getJSON("http://ec2-54-200-107-211.us-west-2.compute.amazonaws.com/api/Lulu")
            .done(function (data) {
                var q = 1;
                for (var ln in data) {
                    if (q == 1)
                        $('#myRankListView').append("<li class='ui-li-has-thumb' id='" + data[ln].idStand + "'><a href='#' class='ui-btn ui-icon-carat-r'><img src='images/trofeu.png'><p>" + data[ln].dsStand + "</p></a></li>");
                    else
                        $('#myRankListView').append("<li class='ui-li-has-thumb' id='" + data[ln].idStand + "'><a href='#' class='ui-btn ui-icon-carat-r'><img src='images/trofeu2.png'><p>" + data[ln].dsStand + "</p></a></li>");
                    q++;
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

    fauxAjax = function fauxAjax(func, text, thisObj) {
        $.mobile.loading('show', { theme: 'a', textVisible: true, text: text });
        window.setTimeout(function () {
            $.mobile.loading('hide');
            func();
        }, 2000);
    };

    return {
        run: run,
    };
}();