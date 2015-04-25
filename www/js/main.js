
var posOptions = { enableHighAccuracy: true, timeout : 10000, maximumAge: 60000};
navigator.geolocation.getCurrentPosition(onSuccess, onError, addMapMarker, posOptions);

var initialScreenSize = window.innerHeight;
window.addEventListener("resize", function() {
    if(window.innerHeight < initialScreenSize){
        $("[data-role=footer]").hide();
    }
    else{
        $("[data-role=footer]").show();
    }
});


var googleLatLng = [],
    latlngs = [],
    db = null,
    markers = {};

    function storeLatLng( lat, lng ) {
        googleLatLng.push(new google.maps.LatLng(lat, lng));
        latlngs.push([lat, lng]);
    }

    document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {

        db = openDatabase("Database", "1.0", "Test DB", 1000000);
        db.transaction(createDB, DBerror, DBsuccess);

        document.addEventListener("backbutton", function(e){
        if($.mobile.activePage.is('#page1')){
            e.preventDefault();
            navigator.notification.confirm(
                'Exit Application?', // message
                 exitApplication,            // callback to invoke with index of button pressed
                '',           // title
                ['Yes','No']         // buttonLabels
            );
        }
        else {
            navigator.app.backHistory()
        }
        }, false);
    }

    function exitApplication(button) {
        if(button=="1" || button==1)
        {

        navigator.app.exitApp();
        }
    }

    function createDB(t) {
        // t.executeSql('DROP TABLE WALKS');
        // t.executeSql('DROP TABLE MARKERS');
        t.executeSql('CREATE TABLE IF NOT EXISTS WALKS (id integer primary key autoincrement, Distance TEXT, Duration TEXT, PathCoordinates TEXT, Images TEXT, WalkTitle Text, WalkDescription Text)');
        t.executeSql('CREATE TABLE IF NOT EXISTS MARKERS (id integer primary key autoincrement, markerid integer, title TEXT, info TEXT, markerLat TEXT, markerLng TEXT, walk_id integer, FOREIGN KEY(walk_id) REFERENCES WALKS(id))');
    }

    function DBerror(error) {
        console.log("Error: " + error.message);
    }

    function DBsuccess(){
        console.log("Success!");
    }

    function onSuccess(position) {

        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        coords = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        storeLatLng(latitude, longitude);

            var mapOptions = {
                zoom: 17,
                center: coords,
                disableDefaultUI: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                title: "You are here!",
                map: map
            });

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
    navigator.geolocation.getCurrentPosition(addMarker, addMarkerFail, {enableHighAccuracy: true});
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
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng()
    };


    //Content structure of info Window for the Markers
    var contentString = '<div id="marker-info-win" data-id="'+marker.id+'">' +
        '<h3>Marker Information</h3>' +
        '<input id="warning-title" contenteditable="true" onkeyup="markerTitle(this, '+marker.id+')" data-text="Warning Title"/></input>'+
        '<i class="fa fa-pencil"></i>' +
        '<input id="warning-additional-info" contenteditable="true" onkeyup="markerInfo(this, '+marker.id+')" data-text="Warning Additional Information"></input>'+
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

    google.maps.event.addListener(infowindow,'closeclick', function(){
        // markers.push(marker);
        console.log(markers);
    });
}
function markerTitle(elem, markerId) {
    markers[markerId].title = elem.value;
}

function markerInfo(elem, markerId) {
    markers[markerId].info = elem.value;
}

function deleteMarker(markerId) {
   delete markers[markerId];
   currentMark.setMap(null);
}


function addMarkerFail(error) {
    alert("Error: " + error.code);
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
    speedTime = [],
    currentTrackID,
    intervalHandle = null;

function track(button) {
    // Start/Resume
    if( !running ) {
        geolocationWatch();
        $("#watchButton").html("PAUSE")
        $("#stopWalk").fadeOut('fast');
        running = true;
        startTime = new Date();
        timerIncrement();
    } else { // Pause/Stop
        running = false;
        clearInterval(theTimer);
        navigator.geolocation.clearWatch(geoWatch);
        past = time;
        $("#watchButton").html("RESUME");
        $("#stopWalk").fadeIn('fast');
    }
}

function geolocationWatch() {
   geoWatch = navigator.geolocation.watchPosition(
        function(position) {
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            // lat = chance.latitude();
            // lng = chance.longitude();

            storeLatLng(lat, lng);

            if (googleLatLng.length > 0) {
              var path = new google.maps.Polyline({
                path: googleLatLng,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 5
              });
              path.setMap(map);
            }

            var lastofArray = latlngs[latlngs.length - 2];
            var Prevlat = lastofArray[0];
            var Prevlng = lastofArray[1];
            console.log("Previous Lat: " + Prevlat, "Previous Lng: " + Prevlng);
            console.log("Current Lat:" + lat, "Current Lng: " + lng);
            console.log(latlngs);

            function calculateDistance(lat, lng, Prevlat, Prevlng){
                var R = 6371; // km
                var dLat = (Prevlat - lat).toRad();
                var dLon = (Prevlng - lng).toRad(); 
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                      Math.cos(lat.toRad()) * Math.cos(Prevlat.toRad()) * 
                      Math.sin(dLon / 2) * Math.sin(dLon / 2); 
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
                var d = R * c;
                return d;
                }
                Number.prototype.toRad = function() {
                return this * Math.PI / 180;
            }
            totalDistance += calculateDistance(lat, lng, Prevlat, Prevlng);
            document.getElementById("distance").innerHTML = totalDistance.toFixed(4) + " KM";

        }, function() {
            alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n')
        }, {
            maximumAge: 30000,
            enableHighAccuracy: true
        }
    ); 
};

var totalDistance = 0;



// ====================================================== END OF LOCATION TRACK ====================================================== //


// ====================================================== START OF STOPWATCH LOGIN ====================================================== //



function timerIncrement() {
    theTimer = setTimeout(function () {
        currentTime = new Date();
        // Past is used as a store of the last total seconds when paused.
        time = past + parseInt(((currentTime.getTime() - startTime.getTime()) / 1000), 10);

        document.getElementById("duration").innerHTML = toDate(time);

        // distanceCalculate('km/h');
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


// ====================================================== END OF LOCATION TRACK ====================================================== //

// ====================================================== START OF CAMERA ====================================================== //

function capturePhoto() {
    navigator.camera.getPicture(onCameraSuccess, onCameraFail, {
        quality: 70, 
        destinationType : Camera.DestinationType.DATA_URI, 
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        popoverOptions: CameraPopoverOptions,
        targetWidth: 640,
        targetHeight: 640,
        saveToPhotoAlbum: true});
}

function onCameraSuccess(imageURI) {
    imageArray.push(imageURI);
}

function onCameraFail(message) {
    alert('Fail because: ' + message);
}

// ====================================================== FINISH WALK ====================================================== //

function stopSession(marker) {
    finishedDuration = document.getElementById("duration").innerText;
    finishedDistance = document.getElementById("distance").innerText;

    $.mobile.changePage( "#map-page");
}