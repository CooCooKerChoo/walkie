        // storedCoords = localStorage.getItem('GoogleLatLng');
        // if(storedCoords) storedCoords = JSON.parse(storedCoords);
        navigator.geolocation.getCurrentPosition(onFinishedSuccess, onFinishedError);

        function onFinishedSuccess(position) {

        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        storeLatLng(latitude, longitude);

            var mapOptions = {
                zoom: 17,
                center: coords,
                mapTypeControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            //create the map, and place it in the HTML map div
            map = new google.maps.Map(document.getElementById("finishedRoute"), mapOptions);

            if (googleLatLng.length > 0) {
              var path = new google.maps.Polyline({
                path: googleLatLng,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 5
              });
              path.setMap(map);
            }
    }

    // onError Callback receives a PositionError object
    //
    function onFinishedError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }