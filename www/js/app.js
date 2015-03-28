

    function showCurrentLocation(position)
     {
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


    var onSuccess = function(position) {

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

    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

// END OF GET CURRENT POSITION AND SHOW ON MAP //

document.getElementById("watchButton").addEventListener("click", trackLocation, false);

var watchID = null;

function trackLocation() {

    var options = { timeout: 30000 };

    watchID = navigator.geolocation.watchPosition(onSuccess, onError, options);
}

function onSuccess() {
    alert('Latitude: '  + position.coords.latitude      + '<br />' +
          'Longitude: ' + position.coords.longitude     + '<br />' +
            '<hr />');
}

    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }