var randomnumber = Math.floor(Math.random()*11000000);
var appLanguage = "hu";
var pushNotification;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {    	        
		checkLanguage();
		
		if( checkConnection() ) {
			app.receivedEvent('deviceready');
		} else {
			if (appLanguage == "hu") {
				document.getElementById("startApp").innerHTML = "Nem tal&aacute;lhat&oacute; internet kapcsolat.<br>K&eacute;rem kapcsolja be az internetet &eacute;s pr&oacute;b&aacute;lja &uacute;jra.";
			} else {
				document.getElementById("startApp").innerHTML = "No internet connection detected!<br>Please turn on internet and try again.";
			}
		}                    
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {		

		try {
			pushNotification = window.plugins.pushNotification;		
			pushNotification.register(
				tokenHandler,
				errorHandler, {
					"badge":"true",
					"sound":"true",
					"alert":"true",
					"ecb":"onNotificationAPN"
			});
		} catch(err) { 
			txt="There was an error on this page.\n\n"; 
			txt+="Error description: " + err.message + "\n\n"; 
			alert(txt); 
		}
		
        //var ref = window.open('http://app.danielnotar.com/?appLanguage=' + appLanguage + '&r=' + randomnumber, '_self', 'location=no,enableViewportScale=yes');
    } 
    
};

// PUSH subs
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
