  // START OF LOCATION TRACK //

    var watchID = null;
    var mapArray = [];

    var path = poly.getPath();

    var walkRoute = new google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
    });

    // device APIs are available
    //
    function startTrack() {
        // Get the most accurate position updates available on the
        // device.
        var options = { enableHighAccuracy: true, maximumAge: 10000 };
        watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
    }

    // onSuccess Geolocation
    //
    function onSuccess(position) {
        mapArray.push(position.coords.latitude, position.coords.longitude);

        path.push(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

        poly.setPath(path);

        // alert(mapArray);

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
