 $(document).on('pageshow', "#map-page", function() {

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
                var posOptions = { enableHighAccuracy: true, timeout : 10000, maximumAge: 60000};
                navigator.geolocation.getCurrentPosition(onSuccess, distanceCalculate, onError, addMapMarker, posOptions);

                    db = openDatabase("Database", "1.0", "Test DB", 1000000);
                    db.transaction(createDB, DBerror, DBsuccess);
            }

            document.addEventListener("deviceready", onDeviceReady, false);

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
            markers[markerId].title = elem.value;
            // markers[markerId].marker.title = elem.innerText;
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
                    var watchOptions = { enableHighAccuracy: false, timeout : 10000, maximumAge: 10000};
                    watchID = navigator.geolocation.watchPosition(onSuccessTrack, onErrorTrack, watchOptions);
                    
                    $("#watchButton").html("PAUSE")
                    $("#stopWalk").fadeOut('fast');
                    running = true;
                    startTime = new Date();
                    timerIncrement();
                    distanceCalculate();
                    // if( currentTrackID === undefined ) {
                    //     currentTrackID = getId();
                    // }
                } else { // Pause/Stop
                    running = false;
                    navigator.geolocation.clearWatch(watchID);
                    clearInterval(theTimer);
                    past = time;
                    $("#watchButton").html("RESUME");
                    $("#stopWalk").fadeIn('fast');
                }
            }

            // function getId() {
            //     if( window.localStorage.getItem('walks') ) {
            //         var walks = JSON.parse(window.localStorage.getItem('walks'));
            //         walks.push(walks.length);
            //         window.localStorage.setItem('walks', walks);
            //         return walks.length-1;
            //     }

            //     window.localStorage.setItem('walks', JSON.stringify([0]));
            //     return 0;
            // }

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

                    console.log("Position found");
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