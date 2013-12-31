/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var randomnumber = Math.floor(Math.random()*11000000);
var appLanguage = "hu"; 

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
        var ref = window.open('http://app.danielnotar.com/?appLanguage=' + appLanguage + '&r=' + randomnumber, '_self', 'location=no');
    } 
    
};

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
