//  function showCurrentLocation(position)
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

function DOMLoaded() {

    document.addEventListener("deviceready", phonegapLoaded, false);

}

function phonegapLoaded() {
    navigator.geolocation.getCurrentPosition(onSuccess);
}

function onSuccess(position) {

    alert("Latitude: " + position.coords.latitude + "\n" +
        "Timestamp: " + new Date(position.timestamp));
}