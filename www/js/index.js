var randomnumber = Math.floor(Math.random()*11000000);
var appLanguage = "hu";
var pushNotification;
var appWindow;
var devicetoken = "";

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
			txt="There was an error on this app.\n\n"; 
			txt+="Error description: " + err.message + "\n\n"; 
			alert(txt); 
		}
		
		checkLanguage();		
		checkConnection();
		app.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
    } 
    
};

$(document).ready(function(){
	$("#contentFrame").width( $(window).width() );
	$("#contentFrame").height( $(window).height() );
	
	alert($(window).width());
	alert($(window).height());
	alert($(window).innerHeight());
	alert(window.height);
	alert(window.innerHeight);
	
	//$("#contentStart").hide();
	//$("#contentNoConnection").hide();
	//$("#contentIframe").show();
});

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
    //alert('device token = ' + result);
	devicetoken = result;
	
	$("#cms-root").load(
		"http://dev.itworx.hu/mobile/apn_token.php",
		{
			appID: "com.webmark.danielnotar",
			token: devicetoken,
			r: randomnumber
		},
		function() {			
		}
	);	
	
	pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, 0);
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
		$("#contentStart").hide();
		$("#contentNoConnection").show();
		$("#contentIframe").hide();
		console.log($("#contentIframe").attr("src"));
        return false;   
    } else {
		$("#contentStart").hide();
		$("#contentNoConnection").hide();
		$("#contentIframe").show();
		console.log($("#contentIframe").attr("src"));
        return true;    
    }
	setTimeout(checkConnection, 5000);
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
