var googleLatLng = [],
    latlngs = [],
    markers = {};

    function storeLatLng( lat, lng ) {
        googleLatLng.push(new google.maps.LatLng(lat, lng));
        latlngs.push([lat, lng]);

            // setcoords = JSON.stringify(googleLatLng);
            // localStorage.setItem('GoogleLatLng', setcoords);

            // console.log(localStorage.getItem("GoogleLatLng"));

            // console.log(googleLatLng);
    }

document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {
        var posOptions = { enableHighAccuracy: true, timeout : 10000, maximumAge: 60000};
        navigator.geolocation.getCurrentPosition(onSuccess, distanceCalculate, onError, addMapMarker, posOptions);

    }


    function onSuccess(position) {

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        storeLatLng(latitude, longitude);

            var mapOptions = {
                zoom: 17,
                center: coords,
                mapTypeControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            //create the map, and place it in the HTML map div
            map = new google.maps.Map(document.getElementById("mapPlaceholder"), mapOptions);
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }


// =================================================== START OF CUSTOM MARKERS ================================================== //

function addMapMarker() {
    navigator.geolocation.getCurrentPosition(addMarker, addMarkerFail);
}

counter = 0;

var currentMark;

function addMarker(position) {
counter++;

    var bridgeIcon = new google.maps.MarkerImage("img/map_markers/warning_map_marker.png", null, null, null);
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        icon: bridgeIcon,
        id: counter
    });

    markers[marker.id] = {
        id: marker.id,
        title: '',
        info: '',
        // title: (document.getElementById("warning-title").value),
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng()
    };


    //Content structure of info Window for the Markers
    var contentString = '<div id="marker-info-win" data-id="'+marker.id+'">' +
        '<h3>Marker Information</h3>' +
        '<div id="warning-title" contenteditable="true" onkeyup="markerTitle(this, '+marker.id+')" data-text="Warning Title"/></div>'+
        '<i class="fa fa-pencil"></i>' +
        '<div id="warning-additional-info" contenteditable="true" onkeyup="markerInfo(this, '+marker.id+')" data-text="Warning Additional Information"></div>'+
        '<i class="fa fa-pencil"></i>' +
        '<br/><button id="deleteButton" name="remove-marker" class="remove-marker" title="Remove Marker" data-id="'+ counter +'">Remove Marker</button></div>';
        
    //Create an infoWindow
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    
    //add click event listener to marker which will open infoWindow          
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,this); // click on marker opens info window 
        currentMark = this;
    });

     google.maps.event.addListener(marker, "dragend", function(event) {
        markers[marker.id].lat = event.latLng.lat();
        markers[marker.id].lng = event.latLng.lng();
    }); 

    google.maps.event.addListener(infowindow, 'domready', function () {
        var button = document.getElementById('deleteButton');
        var id = parseInt(button.getAttribute('data-id'));  
        button.onclick = function() {
            deleteMarker(id);
        };
    });

    // markers = [
    //     [marker.id, marker.getPosition().lat(), marker.getPosition().lng()]
    // ];

    google.maps.event.addListener(infowindow,'closeclick', function(){
        // markers.push(marker);
        console.log(markers);
    });
}

    // window.localStorage.setItem('markers_1', JSON.stringify(markers));
    // JSON.parse(window.localStorage.getItem('markers_1'));
function markerTitle(elem, markerId) {
    markers[markerId].title = elem.innerText;
    markers[markerId].marker.title = elem.innerText;
}

function markerInfo(elem, markerId) {
    markers[markerId].info = elem.innerText;
}

function deleteMarker(markerId) {
   delete markers[markerId];
   currentMark.setMap(null);
}


function addMarkerFail(error) {
    alert("Error: " + error.code);
}

                // var marker = new google.maps.Marker({
                //     positon: event.latLng,
                //     map: map,
                //     draggable: true,
                //     animation: google.maps.Animation.DROP,
                //     title: "Hello World!",
                //     icon: "http://localhost/walkie/www/img/map_markers/pin_green.png"
                // });

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
        speedTime = [],
        currentTrackID;

    function track(button) {
        // Start/Resume
        if( !running ) {
            var watchOptions = { enableHighAccuracy: true, timeout : 5000, maximumAge: 10000};
            watchID = navigator.geolocation.watchPosition(onSuccessTrack, onErrorTrack, watchOptions);
            
            $("#watchButton").html("PAUSE")
            $("#stopWalk").fadeOut('fast');
            running = true;
            startTime = new Date();
            timerIncrement();
            distanceCalculate();
            if( currentTrackID === undefined ) {
                currentTrackID = getId();
            }
        } else { // Pause/Stop
            running = false;
            navigator.geolocation.clearWatch(watchID);
            clearInterval(theTimer);
            past = time;
            $("#watchButton").html("RESUME");
            $("#stopWalk").fadeIn('fast');
        }
    }

    function getId() {
        if( window.localStorage.getItem('walks') ) {
            var walks = JSON.parse(window.localStorage.getItem('walks'));
            walks.push(walks.length);
            window.localStorage.setItem('walks', walks);
            return walks.length-1;
        }

        window.localStorage.setItem('walks', JSON.stringify([0]));
        return 0;
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

        overallDistance = (pastDistance + current);
        document.getElementById("distance").innerHTML = (overallDistance).toFixed(3) + ' ' + measurements;
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
        navigator.camera.getPicture(onCameraSuccess, onCameraFail, {
            quality: 70, 
            destinationType : Camera.DestinationType.DATA_URL, 
            sourceType: Camera.PictureSourceType.CAMERA,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true});
    }

    function onCameraSuccess(imageData) {
        var img = new Image();
        img.src =  "data:image/jpeg; base64," + imageData; //js global var

        img.onload = function( ) {

            var canvas  =  document.getElementById( 'myCanvas' ); 
            canvas.setAttribute( "width", img.naturalWidth );
            canvas.setAttribute( "height", img.naturalHeight );

            var context  =  canvas.getContext( '2d' );
            context.drawImage( img, 0, 0 );
            canvas.style.width = "100%"; 
            var data = canvas.toDataURL("image/jpeg");
            document.getElementById("imageString").value = data;
            var images = JSON.parse(localStorage.getItem("images_" + currentTrackID)) || [];
            images.push(data);
            localStorage.setItem("images_" + currentTrackID, JSON.stringify(images));
        }
    }

    function onCameraFail(message) {
        alert('Fail because: ' + message);
    }

// ====================================================== FINISH WALK ====================================================== //

function stopSession() {
    finishedDuration = document.getElementById("duration").innerText;
    localStorage.setItem("overallTime_" + currentTrackID, finishedDuration);

    finishedDistance = document.getElementById("distance").innerText;
    localStorage.setItem("overallDistance_" + currentTrackID, finishedDistance)

    localStorage.setItem("completePath_" + currentTrackID, googleLatLng)

    localStorage.setItem("markers_" + currentTrackID, JSON.stringify(markers))

    window.location.href = "#map-page";
}