 $(document).on('pageinit', "#map-page", function() {

            $("#photosContainer").mCustomScrollbar({
                axis:"x",
                theme:"dark-thick",
                autoExpandScrollbar:true,
                advanced:{autoExpandHorizontalScroll:true}
            });

            var mapOptions = {
                zoom: 15,
                center: coords,
                mapTypeControl: false,
                streetViewControl:false,
                zoomControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            //create the map, and place it in the HTML map div
            map = new google.maps.Map(document.getElementById("finishedRoute"), mapOptions);

        setTimeout(function() {
            google.maps.event.trigger(map, "resize");
            map.setCenter(coords);
        }, 1000);

            if (googleLatLng.length > 0) {
              var path = new google.maps.Polyline({
                path: googleLatLng,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 5
              });
              path.setMap(map);
            }

            var marker;
            for (id in markers) {
                if( markers.hasOwnProperty(id) ) {
                    marker = markers[id];
                    var bridgeIcon = new google.maps.MarkerImage("img/map_markers/warning_map_marker.png", null, null, null);
                    marker = new google.maps.Marker({
                        position: new google.maps.LatLng(marker.lat, marker.lng),
                        map: map,
                        icon: bridgeIcon
                    });
                    /*google.maps.event.addListener(marker, 'click', (function(marker, i) {
                        return function() {
                            infowindow.setContent(markers[i][0]);
                            infowindow.open(map, marker);
                        }
                    })(marker, id));*/
                }
            }  

            var storedDuration = localStorage.getItem("overallTime_" + currentTrackID)
            if(storedDuration) {
                document.getElementById("finalDuration").innerHTML = storedDuration;
            }

            var storedDistance = localStorage.getItem("overallDistance_" +currentTrackID)
            if(storedDistance) {
                document.getElementById("finalDistance").innerHTML = storedDistance;
            }

            var storedPath = localStorage.getItem("completePath_" +currentTrackID)
            if(storedPath) {
                // alert(storedPath);
            }

            var storedMarkers = localStorage.getItem("totalMarkers_" + currentTrackID)
            if(storedMarkers) {
                document.getElementById('markersArray').value = JSON.stringify(markers);
            }

});

             function getPicture() {
                var images = window.localStorage.getItem('images_' + currentTrackID);

                for( var i = 0, c = images.length; i < c; i++ ) {
                    // Create new Image element
                    var img = $('<img class="image"/>');
                    img.attr('src', 'data:image/jpeg;base64,' + images[i]);

                    // Append new img to our photos div
                    img.appendTo('.photos');
                }
            }

            function saveInfo() {
                var saveAllInfo = document.getElementById("walkDescription").innerText;
                localStorage.setItem("walkDescription_" + currentTrackID, saveAllInfo);
            }