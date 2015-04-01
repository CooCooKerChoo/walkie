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


// ====================================================== START OF LOCATION TRACK ====================================================== //

    function startTrack() {
        var watchOptions = { enableHighAccuracy: true, timeout : 10000, maximumAge: 1000};
        watchID = navigator.geolocation.watchPosition(onSuccessTrack, onErrorTrack, watchOptions);

        timerIncrement();
        distanceCalculate();

        $("#watchButton").attr("onclick","stopTrack()");
    }

        var watchID;
        var latlngs = [];

        function onSuccessTrack(position) {

        lat = position.coords.latitude;
        lon = position.coords.longitude;
        latlng = new google.maps.LatLng(lat, lon);

        if (latlngs.length > 0) {
          prevLatlng = latlngs[latlngs.length -1];
          pathLatlng = [prevLatlng, latlng];
          var path = new google.maps.Polyline({
            path: pathLatlng,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 5
          });
          path.setMap(map);
        }

        latlngs.push(latlng);

        speed = position.coords.speed;
        distanceCalculate(speed);

        }

        function onErrorTrack(error) {
          alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }

    // mapArray.push(position.coords.latitude, position.coords.longitude);



// ====================================================== END OF LOCATION TRACK ====================================================== //


// ====================================================== START OF STOPWATCH LOGIN ====================================================== //

    
    time = 0;

    function timerIncrement() {
        setTimeout(function(){
            time ++;
            var hours = Math.floor(time/10/60/60)
            var mins = Math.floor(time/10/60);
            var secs = Math.floor(time/10 % 60);

            if(hours < 10)
            {
                hours = "0" + hours;
            }
            if(mins < 10)
            {
                mins = "0" + mins;
            }
            if(secs < 10)
            {
                secs = "0" + secs;
            }
            document.getElementById("duration").innerHTML = hours + ":" + mins + ":" + secs;
            totalSeconds = Math.floor(time/10);

            timerIncrement();
            distanceCalculate(totalSeconds);
        }, 
        100)
    }


    function distanceCalculate() {
        distance = 0;
        if(speed === null) {
            speed = 0;
        }
        distanceCalc = speed * totalSeconds;
        distance += distanceCalc;
        document.getElementById("speed").innerHTML = speed + "m/s";
        document.getElementById("distance").innerHTML = distance.toFixed(1); + "m";
    }
