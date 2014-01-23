var randomnumber = Math.floor(Math.random()*11000000);
var appLanguage = "hu";
//var pushNotification;

function registerPushwooshIOS() {
         var pushNotification = window.plugins.pushNotification;

         //push notifications handler
        document.addEventListener('push-notification', function(event) {
                                var notification = event.notification;
                                navigator.notification.alert(notification.aps.alert);
                                
                                //to view full push payload
                                //navigator.notification.alert(JSON.stringify(notification));
                                
                                //reset badges on icon
                                pushNotification.setApplicationIconBadgeNumber(0);
                          });

        pushNotification.registerDevice({alert:true, badge:true, sound:true, pw_appid:"8E0ED-AA051", appname:"DanielNotar"},
                                                                        function(status) {
                                                                                var deviceToken = status['deviceToken'];
                                                                                console.warn('registerDevice: ' + deviceToken);
                                                                                onPushwooshiOSInitialized(deviceToken);
                                                                        },
                                                                        function(status) {
                                                                                console.warn('failed to register : ' + JSON.stringify(status));
                                                                                navigator.notification.alert(JSON.stringify(['failed to register ', status]));
                                                                        });
        
        //reset badges on start
        pushNotification.setApplicationIconBadgeNumber(0);
}

function onPushwooshiOSInitialized(pushToken)
{
        var pushNotification = window.plugins.pushNotification;
        //retrieve the tags for the device
        pushNotification.getTags(function(tags) {
                                                                console.warn('tags for the device: ' + JSON.stringify(tags));
                                                         },
                                                         function(error) {
                                                                console.warn('get tags error: ' + JSON.stringify(error));
                                                         });
         
        //start geo tracking. PWTrackSignificantLocationChanges - Uses GPS in foreground, Cell Triangulation in background. 
        pushNotification.startLocationTracking('PWTrackSignificantLocationChanges',
                                                                        function() {
                                                                                   console.warn('Location Tracking Started');
                                                                        });
}

function registerPushwooshAndroid() {

         var pushNotification = window.plugins.pushNotification;

        //push notifications handler
        document.addEventListener('push-notification', function(event) {
                    var title = event.notification.title;
                    var userData = event.notification.userdata;

                    //dump custom data to the console if it exists
                    if(typeof(userData) != "undefined") {
                                        console.warn('user data: ' + JSON.stringify(userData));
                                }

                                //and show alert
                                navigator.notification.alert(title);

                                //stopping geopushes
                                pushNotification.stopGeoPushes();
                          });

        //projectid: "GOOGLE_PROJECT_ID", appid : "PUSHWOOSH_APP_ID"
        pushNotification.registerDevice({ projectid: "60756016005", appid : "4F0C807E51EC77.93591449" },
                                                                        function(token) {
                                                                                alert(token);
                                                                                //callback when pushwoosh is ready
                                                                                onPushwooshAndroidInitialized(token);
                                                                        },
                                                                        function(status) {
                                                                                alert("failed to register: " +  status);
                                                                            console.warn(JSON.stringify(['failed to register ', status]));
                                                                        });
 }

function onPushwooshAndroidInitialized(pushToken)
{
        //output the token to the console
        console.warn('push token: ' + pushToken);

        var pushNotification = window.plugins.pushNotification;
        
        pushNotification.getTags(function(tags) {
                                                        console.warn('tags for the device: ' + JSON.stringify(tags));
                                                 },
                                                 function(error) {
                                                        console.warn('get tags error: ' + JSON.stringify(error));
                                                 });
         

        //set multi notificaiton mode
        //pushNotification.setMultiNotificationMode();
        //pushNotification.setEnableLED(true);
        
        //set single notification mode
        //pushNotification.setSingleNotificationMode();
        
        //disable sound and vibration
        //pushNotification.setSoundType(1);
        //pushNotification.setVibrateType(1);
        
        pushNotification.setLightScreenOnNotification(false);
        
        //goal with count
        //pushNotification.sendGoalAchieved({goal:'purchase', count:3});
        
        //goal with no count
        //pushNotification.sendGoalAchieved({goal:'registration'});

        //setting list tags
        //pushNotification.setTags({"MyTag":["hello", "world"]});
        
        //settings tags
        pushNotification.setTags({deviceName:"hello", deviceId:10},
                                                                        function(status) {
                                                                                console.warn('setTags success');
                                                                        },
                                                                        function(status) {
                                                                                console.warn('setTags failed');
                                                                        });
                
        function geolocationSuccess(position) {
                pushNotification.sendLocation({lat:position.coords.latitude, lon:position.coords.longitude},
                                                                 function(status) {
                                                                          console.warn('sendLocation success');
                                                                 },
                                                                 function(status) {
                                                                          console.warn('sendLocation failed');
                                                                 });
        };
                
        // onError Callback receives a PositionError object
        //
        function geolocationError(error) {
                alert('code: '    + error.code    + '\n' +
                          'message: ' + error.message + '\n');
        }
        
        function getCurrentPosition() {
                navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
        }
        
        //greedy method to get user position every 3 second. works well for demo.
//        setInterval(getCurrentPosition, 3000);
                
        //this method just gives the position once
//        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
                
        //this method should track the user position as per Phonegap docs.
//        navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, { maximumAge: 3000, enableHighAccuracy: true });

        //Pushwoosh Android specific method that cares for the battery
        pushNotification.startGeoPushes();
}

 function initPushwoosh() {
        var pushNotification = window.plugins.pushNotification;
        if(device.platform == "Android")
        {
                registerPushwooshAndroid();
                pushNotification.onDeviceReady();
        }

        if(device.platform == "iPhone" || device.platform == "iOS")
        {
                registerPushwooshIOS();
                pushNotification.onDeviceReady();
        }
}

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
		initPushwoosh();
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

		//try {
		//	pushNotification = window.plugins.pushNotification;		
		//	pushNotification.register(
		//		tokenHandler,
		//		errorHandler, {
		//			"badge":"true",
		//			"sound":"true",
		//			"alert":"true",
		//			"ecb":"onNotificationAPN"
		//	});
		//} catch(err) { 
		//	txt="There was an error on this page.\n\n"; 
		//	txt+="Error description: " + err.message + "\n\n"; 
		//	alert(txt); 
		//}
		
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
    //alert('device token = ' + result);
	//
	//$("#cms-root").load(
	//	"http://dev.itworx.hu/mobile/apn_token.php",
	//	{
	//		appID: "com.webmark.danielnotar",
	//		token: result,
	//		r: randomnumber
	//	},
	//	function(r) {
	//		//alert(r);
	//	}
	//);
	//pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, 0);
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
