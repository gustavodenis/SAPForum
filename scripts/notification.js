function registerPushwooshIOS() {
    var pushNotification = window.plugins.pushNotification;

    //push notifications handler
    document.addEventListener('push-notification', function (event) {
        var notification = event.notification;
        navigator.notification.alert(notification.aps.alert);

        //to view full push payload
        //navigator.notification.alert(JSON.stringify(notification));

        //reset badges on icon
        pushNotification.setApplicationIconBadgeNumber(0);
    });

    pushNotification.registerDevice({ alert: true, badge: true, sound: true, pw_appid: "F4C02-5215F", appname: "SAPForumPushWoosh" },
                                                                    function (status) {
                                                                        var deviceToken = status['deviceToken'];
                                                                        console.warn('registerDevice: ' + deviceToken);
                                                                        onPushwooshiOSInitialized(deviceToken);
                                                                    },
                                                                    function (status) {
                                                                        console.warn('failed to register : ' + JSON.stringify(status));
                                                                        navigator.notification.alert(JSON.stringify(['failed to register ', status]));
                                                                    });

    //reset badges on start
    pushNotification.setApplicationIconBadgeNumber(0);
}

function onPushwooshiOSInitialized(pushToken) {
    var pushNotification = window.plugins.pushNotification;
    //retrieve the tags for the device
    pushNotification.getTags(function (tags) {
        console.warn('tags for the device: ' + JSON.stringify(tags));
    },
                                                     function (error) {
                                                         console.warn('get tags error: ' + JSON.stringify(error));
                                                     });
}

function registerPushwooshAndroid() {

    var pushNotification = window.plugins.pushNotification;

    //push notifications handler
    document.addEventListener('push-notification', function (event) {
        var title = event.notification.title;
        var userData = event.notification.userdata;

        //dump custom data to the console if it exists
        if (typeof (userData) != "undefined") {
            console.warn('user data: ' + JSON.stringify(userData));
        }

        //and show alert
        navigator.notification.alert(title);
    });

    //projectid: "GOOGLE_PROJECT_ID", appid : "PUSHWOOSH_APP_ID"
    pushNotification.registerDevice({ projectid: "683239994824", appid: "F4C02-5215F" },
                                                                    function (token) {
                                                                        alert(token);
                                                                        //callback when pushwoosh is ready
                                                                        onPushwooshAndroidInitialized(token);
                                                                    },
                                                                    function (status) {
                                                                        alert("failed to register: " + status);
                                                                        console.warn(JSON.stringify(['failed to register ', status]));
                                                                    });
}

function onPushwooshAndroidInitialized(pushToken) {
    //output the token to the console
    console.warn('push token: ' + pushToken);
    var pushNotification = window.plugins.pushNotification;

    pushNotification.getTags(function (tags) {
        console.warn('tags for the device: ' + JSON.stringify(tags));
    },
                                             function (error) {
                                                 console.warn('get tags error: ' + JSON.stringify(error));
                                             });

    pushNotification.setLightScreenOnNotification(false);
    //settings tags
    pushNotification.setTags({ deviceName: "hello", deviceId: 10 },
                                                                    function (status) {
                                                                        console.warn('setTags success');
                                                                    },
                                                                    function (status) {
                                                                        console.warn('setTags failed');
                                                                    });
}

function initPushwoosh() {
    var pushNotification = window.plugins.pushNotification;
    if (device.platform == "Android") {
        registerPushwooshAndroid();
        pushNotification.onDeviceReady();
    }

    if (device.platform == "iPhone" || device.platform == "iOS") {
        registerPushwooshIOS();
        pushNotification.onDeviceReady();
    }
}

var appNotify = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        initPushwoosh();
        appNotify.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        $('.notifyreceived').text(id);
    }
};