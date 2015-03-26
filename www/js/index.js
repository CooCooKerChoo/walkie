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

var onSuccess = function(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

navigator.geolocation.getCurrentPosition(onSuccess, onError);