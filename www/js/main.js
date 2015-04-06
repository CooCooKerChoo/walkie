var googleLatLng = [],
    latlngs = [];

    function storeLatLng( lat, lng ) {
        googleLatLng.push(new google.maps.LatLng(lat, lng));
        latlngs.push([lat, lng]);
    }

document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {
        var posOptions = { enableHighAccuracy: true, timeout : 10000, maximumAge: 60000};
        navigator.geolocation.getCurrentPosition(onSuccess, distanceCalculate, onError, posOptions);
    }


    function onSuccess(position) {

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


// =================================================== START OF CUSTOM MARKERS ================================================== //

$(document).ready(function() {
    $("#map_marker").click(function(){
        $("#map_marker_container").toggle('slow');
    });
});


function addBridgeIcon(position) {
        var bridgeIcon = new google.maps.MarkerImage("img/map_markers/bridge_map_marker.svg", null, null, null, new google.maps.Size(50, 50));
        var bridgeMarker = new google.maps.Marker({
        position: coords,
        map: map,
        icon: bridgeIcon
    });
}

function addWaterIcon(position) {
        var waterIcon = new google.maps.MarkerImage("img/map_markers/water_map_marker.svg", null, null, null, new google.maps.Size(50, 50));
        var waterMarker = new google.maps.Marker({
        position: coords,
        map: map,
        icon: waterIcon
    });
}

function addRocksIcon(position) {
        var rocksIcon = new google.maps.MarkerImage("img/map_markers/rocks_map_marker.svg", null, null, null, new google.maps.Size(50, 50));
        var rocksMarker = new google.maps.Marker({
        position: coords,
        map: map,
        icon: rocksIcon
    });
}

function addUnevenIcon(position) {
        var unevenIcon = new google.maps.MarkerImage("img/map_markers/uneven_map_marker.svg", null, null, null, new google.maps.Size(50, 50));
        var unevenMarker = new google.maps.Marker({
        position: coords,
        map: map,
        icon: unevenIcon
    });
}

function addBlockageIcon(position) {
        var blockageIcon = new google.maps.MarkerImage("img/map_markers/path_blockage_map_marker.svg", null, null, null, new google.maps.Size(50, 50));
        var blockageMarker = new google.maps.Marker({
        position: coords,
        map: map,
        icon: blockageIcon
    });
}

// ====================================================== START OF LOCATION TRACK ====================================================== //

    var startTime, currentTime,
        time = 0,
        totalSeconds = 0,
        theTimer,
        speed = 0,
        currentSpeed = 0,
        past = 0,
        watchID,
        running = false,
        distance = [],
        imageArray = [],
        speedTime = [];

    function track(button) {
        // Start/Resume
        if( !running ) {
            var watchOptions = { enableHighAccuracy: true, timeout : 5000, maximumAge: 10000};
            watchID = navigator.geolocation.watchPosition(onSuccessTrack, onErrorTrack, watchOptions);
            
            $("#watchButton i").attr("class","size-48 fi-pause");
            $("#stopWalk").fadeOut('fast');
            running = true;
            startTime = new Date();
            timerIncrement();
            distanceCalculate();
        } else { // Pause/Stop
            running = false;
            navigator.geolocation.clearWatch(watchID);
            clearInterval(theTimer);
            past = time;
            $("#watchButton i").attr("class","size-48 fi-record");
            $("#stopWalk").fadeIn('fast');
        }
    }

        function onSuccessTrack(position) {

            lat = position.coords.latitude;
            lon = position.coords.longitude;
    
            storeLatLng(lat, lon);

            if (googleLatLng.length > 0) {
              var path = new google.maps.Polyline({
                path: googleLatLng,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 5
              });
              path.setMap(map);
            }

            currentSpeed = position.coords.speed;
            if ( currentSpeed != speed ) {
                handleSpeedChange( speed );
                speed = currentSpeed;
            }
        }

        function onErrorTrack(error) {
          alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }



// ====================================================== END OF LOCATION TRACK ====================================================== //


// ====================================================== START OF STOPWATCH LOGIN ====================================================== //



    function timerIncrement() {
        theTimer = setTimeout(function () {
            currentTime = new Date();
            // Past is used as a store of the last total seconds when paused.
            time = past + parseInt(((currentTime.getTime() - startTime.getTime()) / 1000), 10);

            document.getElementById("duration").innerHTML = toDate(time);

            distanceCalculate('km/h');
            timerIncrement();
        },
        100)
    }

    function toDate( totalSec ) {
        var hours = parseInt( totalSec / 3600 ) % 24,
            minutes = parseInt( totalSec / 60 ) % 60,
            seconds = totalSec % 60;

        return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
    }

    var totalDistance = 0;

    function distanceCalculate( measurement ) {
        measurement = measurement || 'm/s';

    var tempTime = 0;
    for( var i = 0, c = speedTime.length; i < c; i++) {
        tempTime += speedTime[i].time;
    }

    if(speed < speedTime[speedTime.length - 1]) {
        handleSpeedChange();
    } else if(speed > speedTime[speedTime.length - 1]){
        handleSpeedChange();
    }

        switch( measurement ) {
            case 'km/h':
                totalDistance = (speed * 3.6) * ( time / 60 / 60 );
                distanceOutput(totalDistance, "km");
                break;
            case 'mph':
                totalDistance = (speed * 2.236936) * (time /60 / 60);
                distanceOutput(totalDistance, "miles");
                break;
            case 'm/s':
            default:
                totalDistance = (speed * time);
                distanceOutput(totalDistance, "m");
                break;
        }
    }

    function distanceOutput( current, measurements ) {
        var pastDistance = 0;
        for( var i = 0, c = speedTime.length; i < c; i++) {
            pastDistance += calculate_metres(speedTime[i].speed, speedTime[i].time);
        }
        document.getElementById("distance").innerHTML = (pastDistance + current).toFixed(3) + ' ' + measurements;
    }


    function handleSpeedChange( oldSpeed ) {
        speedTime.push({ speed: oldSpeed, time: time });
    }

    function calculate_metres( speed, time ) {
        return speed * time;
    }
    function calculate_kilometres( speed, time ) {}
    function calculate_miles( speed, time ) {}

// ====================================================== END OF LOCATION TRACK ====================================================== //

// ====================================================== START OF CAMERA ====================================================== //

    function capturePhoto() {
        navigator.camera.getPicture(onCameraSuccess, onCameraFail, {quality: 70, destinationType : Camera.DestinationType.DATA_URL});
    }

    function onCameraSuccess(imageData) {
        //In our success call we want to first process the image to save in our image box on the screen.

        var image = document.getElementById('image');
        image.src = "data:image/jpeg;base64," + imageData;

        //Create a new canvas for our image holder

        var imgCanvas = document.createElement("canvas"),
        imgContext = imgCanvas.getContext("2d");

        // Make sure canvas is as big as the picture
        imgCanvas.width = image.width;
        imgCanvas.height = image.height;

        // Draw image into canvas element
        imgContext.drawImage(image, 0, 0, image.width, image.height);

        // Get canvas contents as a data URL
        var imgAsDataURL = imgCanvas.toDataURL("image/png");

        // Save image into localStorage
        try {
        // localStorage.setItem(“savedImage”, imgAsDataURL);
        localStorage.setItem("savedImage", imageData);
        alert('Image Saved');
        }
        catch (e) {
        alert("Storage failed: " + e);
        }

        var imageStorage = localStorage.getItem("savedImage");
        // myCardHolder= document.getElementById(“m1-cardStorage-image1″);
        // Reuse existing Data URL from localStorage
        var image = document.getElementById('image');
        image.src = "data:image/jpeg;base64," + imageStorage;
    }

    function onCameraFail(message) {
        alert('Fail because: ' + message);
    }

// ====================================================== FINISH WALK ====================================================== //
