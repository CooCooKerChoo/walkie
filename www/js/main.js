document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        watchID = navigator
    }

    // onSuccess Geolocation
    //
    function onSuccess(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var coords = new google.maps.LatLng(latitude, longitude);

            var mapOptions = {
                zoom: 17,
                center: coords,
                mapTypeControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            //create the map, and place it in the HTML map div
            map = new google.maps.Map(
                document.getElementById("mapPlaceholder"), mapOptions
                );

            //place the initial marker
            var marker = new google.maps.Marker({
                position: coords,
                map: map,
                title: "Current location!"
            });
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

  // START OF LOCATION TRACK //

    var watchID = null;
    var mapArray = [];

    var path = poly.getPath();

    // device APIs are available
    //
    function startTrack() {
        // Get the most accurate position updates available on the
        // device.
        var options = { enableHighAccuracy: true, maximumAge: 10000 };
        watchID = navigator.geolocation.watchPosition(onSuccessTrack, onErrorTrack, options);
    }

    // onSuccess Geolocation
    //
    function onSuccessTrack(position) {

        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        mapArray.push(position.coords.latitude, position.coords.longitude);

        window.sessionStorage.setItem("latitude", latitude);
        window.sessionStoage.setItem("longitude", longitude);

        alert(
            window.sessionStorage.getItem("latitude") + window.sessionStorage.getItem("longitude")
            );
    }

        // onError Callback receives a PositionError object
        //
        function onErrorTrack(error) {
          alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }
