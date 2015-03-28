

    // function showCurrentLocation(position)
    //  {
    //     var latitude = position.coords.latitude;
    //     var longitude = position.coords.longitude;
    //     var coords = new google.maps.LatLng(latitude, longitude);

    //     var mapOptions = {
    //         zoom: 17,
    //         center: coords,
    //         mapTypeControl: true,
    //         mapTypeId: google.maps.MapTypeId.ROADMAP
    //     };

    //     //create the map, and place it in the HTML map div
    //     map = new google.maps.Map(
    //         document.getElementById("mapPlaceholder"), mapOptions
    //         );

    //     //place the initial marker
    //     var marker = new google.maps.Marker({
    //         position: coords,
    //         map: map,
    //         title: "Current location!"
    //     });
    // }


    // var onSuccess = function(position) {

    //     var latitude = position.coords.latitude;
    //     var longitude = position.coords.longitude;
    //     var coords = new google.maps.LatLng(latitude, longitude);

    //     var mapOptions = {
    //         zoom: 17,
    //         center: coords,
    //         mapTypeControl: true,
    //         mapTypeId: google.maps.MapTypeId.ROADMAP
    //     };

    //     //create the map, and place it in the HTML map div
    //     map = new google.maps.Map(
    //         document.getElementById("mapPlaceholder"), mapOptions
    //         );

    //     //place the initial marker
    //     var marker = new google.maps.Marker({
    //         position: coords,
    //         map: map,
    //         title: "Current location!"
    //     });

    // };

    // onError Callback receives a PositionError object
    //

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
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

    // START OF LOCATION TRACK //

    var watchID = null;

    // device APIs are available
    //
    function onDeviceReady() {
        // Get the most accurate position updates available on the
        // device.
        var options = { enableHighAccuracy: true };
        watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
        
        // onSuccess Geolocation
        //
        function onSuccess(position) {
            var element = document.getElementById('geolocation');
            element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
                                'Longitude: ' + position.coords.longitude     + '<br />' +
                                '<hr />'      + element.innerHTML;
        }

        // clear the watch that was started earlier
        //
        function clearWatch() {
            if (watchID != null) {
                navigator.geolocation.clearWatch(watchID);
                watchID = null;
            }
        }

            // onError Callback receives a PositionError object
            //
            function onError(error) {
              alert('code: '    + error.code    + '\n' +
                    'message: ' + error.message + '\n');
            }
    }

