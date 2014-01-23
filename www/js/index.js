var randomnumber = Math.floor(Math.random()*11000000);
var appLanguage = "hu";
var pushNotification;

// deviceready Event Handler
//
// The scope of 'this' is the event. In order to call the 'receivedEvent'
// function, we must explicity call 'app.receivedEvent(...);'
function onDeviceReady() {

	initPushwoosh();
	checkLanguage();
	
	if( checkConnection() ) {
		//app.receivedEvent('deviceready');
		//var ref = window.open('http://app.danielnotar.com/?appLanguage=' + appLanguage + '&r=' + randomnumber, '_self', 'location=no,enableViewportScale=yes');
	} else {
		if (appLanguage == "hu") {
			document.getElementById("startApp").innerHTML = "Nem tal&aacute;lhat&oacute; internet kapcsolat.<br>K&eacute;rem kapcsolja be az internetet &eacute;s pr&oacute;b&aacute;lja &uacute;jra.";
		} else {
			document.getElementById("startApp").innerHTML = "No internet connection detected!<br>Please turn on internet and try again.";
		}
	}                    
}

// PUSH subs

function initPushwoosh() {
    var pushNotification = window.plugins.pushNotification;
    pushNotification.onDeviceReady();
     
    pushNotification.registerDevice({alert:true, badge:true, sound:true, pw_appid:"8E0ED-AA051", appname:"DanielNotar"},
        function(status) {
            var deviceToken = status['deviceToken'];
			alert('registerDevice = ' + deviceToken);
            console.warn('registerDevice: ' + deviceToken);
        },
        function(status) {
            console.warn('failed to register : ' + JSON.stringify(status));
            navigator.notification.alert(JSON.stringify(['failed to register ', status]));
        }
    );
     
    pushNotification.setApplicationIconBadgeNumber(0);
     
    document.addEventListener('push-notification', function(event) {
        var notification = event.notification;
        navigator.notification.alert(notification.aps.alert);
        pushNotification.setApplicationIconBadgeNumber(0);
    });
}

// result contains any message sent from the plugin call
function successHandler (result) {
    //alert('result = ' + result);
}

// result contains any error description text returned from the plugin call
function errorHandler (error) {
    alert('error = ' + error);
}

function tokenHandler (result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
	$("#cms-root").load(
		"http://dev.itworx.hu/mobile/apn_token.php",
		{
			appID: "com.webmark.danielnotar",
			token: result,
			r: randomnumber
		},
		function(r) {
			//alert(r);
		}
	);	
	
    alert('device token = ' + result);
}

// iOS
function onNotificationAPN (event) {
    if ( event.alert ) {
        navigator.notification.alert(event.alert);
    }

    if ( event.sound ) {
        var snd = new Media(event.sound);
        snd.play();
    }

    if ( event.badge ) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}
// PUSH end

function checkConnection() {
    var networkState = navigator.connection.type;

    if (networkState == Connection.UNKNOWN || networkState == Connection.NONE) {
        return false;   
    } else {
        return true;    
    }
}

function checkLanguage() {
	navigator.globalization.getLocaleName(
	  function (language) { 
	  	appLanguage = language.value; 
	  },
	  function () { 
	  	appLanguage = ""; 
	  }
	);
	appLanguage = appLanguage.substr(0, 2);
}

document.addEventListener('deviceready', onDeviceReady, true);