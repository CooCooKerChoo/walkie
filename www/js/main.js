
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


  // START OF LOCATION TRACK //

    document.addEventListener("deviceready", onDeviceReady, false);

    var watchID = null;

    // device APIs are available
    //
    function onDeviceReady() {
        // Get the most accurate position updates available on the
        // device.
        var options = { enableHighAccuracy: true, timeout: 10000 };
        watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
    }

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
