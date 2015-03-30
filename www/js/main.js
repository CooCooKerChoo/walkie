
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    
    // onSuccess Geolocation
    //


    function onSuccess(position) {

        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

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

    function startTrack() {
        var options = { enableHighAccuracy: true, maximumAge: 0, timeout : 5000 };
        watchID = navigator.geolocation.watchPosition(onSuccessTrack, onErrorTrack, options);

        var polyOptions = {
            strokeColor: '#000000',
            strokeOpacity: 1.0,
            strokeWeight: 3
        };
        poly = new google.maps.Polyline(polyOptions);
        poly.setMap(map);

    }

    function onSuccessTrack(position) {

        var latlngs = [];

    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var latlng = new google.maps.LatLng(lat, lon);

    if (latlngs.length > 0) {
      var prevLatlng = latlngs[latlngs.length -1];
      var pathLatlng = [prevLatlng, latlng];
      var path = new google.maps.Polyline({
        path: pathLatlng,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 10
      });
      path.setMap(map);
    }
    latlngs.push(latlng);
    }

        // onError Callback receives a PositionError object
        //
        function onErrorTrack(error) {
          alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }


    // mapArray.push(position.coords.latitude, position.coords.longitude);
