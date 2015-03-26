    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showCurrentLocation);
    }
    else
    {
     alert("Geolocation API not supported.");
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