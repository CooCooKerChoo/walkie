
var posOptions = { enableHighAccuracy: true, timeout : 10000, maximumAge: 60000};
navigator.geolocation.getCurrentPosition(onSuccess, onError, posOptions);

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
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }


  // START OF LOCATION TRACK //

    var watchID;
    var latlngs = [];

    function onSuccessTrack(position) {

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


    function startTrack() {
        var watchOptions = { enableHighAccuracy: true, timeout : 10000, maximumAge: 60000};
        watchID = navigator.geolocation.watchPosition(onSuccessTrack, onErrorTrack, options);
    }

    // mapArray.push(position.coords.latitude, position.coords.longitude);
