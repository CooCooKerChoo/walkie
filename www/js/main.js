document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {
        navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }

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
    

