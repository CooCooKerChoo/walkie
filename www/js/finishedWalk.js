 $(document).on('pageshow', "#map-page", function() {

    dbstoreDistance = document.getElementById("finalDistance").innerText = finishedDistance;
    dbstoreDuration = document.getElementById("finalDuration").innerText = finishedDuration;

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

            for( var i = 0, c = imageArray.length; i < c; i++ ) {

                $(".photos").append('<a href="#popup' + i + '"data-rel="popup" data-position-to="window" data-transition="fade"><img class="image" src="' + imageArray[i] + '"></a>');

                // $("#map-page").append('<div data-role="popup" class="imagePopups" id="#popup' + i + '><a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a><img class="popupphoto" src="' + imageArray[i] + '" width="300"></div>').trigger('create');
                $('#map-page').append('<div data-role="popup" id="popup' + i + '" class="imagePopups" data-overlay-theme="a" data-theme="d" data-corners="false"><a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a> <img class="popphoto" src="' + imageArray[i] + '" style="max-height:512px;" alt="photo, test"></div>').trigger('create');
            }

});



            function saveInfo() {
                var walkTitle = document.getElementById("walkTitle").value;
                var walkDescription = document.getElementById("walkDescription").value;
                var markersArray = JSON.stringify(markers);
                var walkID; 

                db.transaction(function(t) {
                    t.executeSql('INSERT INTO WALKS (Duration, Distance, PathCoordinates, Images, WalkTitle, WalkDescription) values (?,?,?,?,?,?)', [dbstoreDuration, dbstoreDistance, googleLatLng, imageArray, walkTitle, walkDescription], 
                        function(t, results){
                            console.log('ok');
                            walkID = results.insertId;
                            for(var id in markers) {
                                if( markers.hasOwnProperty(id) ) {
                                    (function(id) {
                                        db.transaction(function(t) {
                                            var marker = markers[id];
                                            t.executeSql('INSERT INTO MARKERS (markerid, title, info, markerLat, markerLng, walk_id) values (?,?,?,?,?,?)', [markers[id].id, markers[id].title, markers[id].info, markers[id].lat, markers[id].lng, walkID]);
                                        });
                                        })(id);
                                }
                            }
                        },
                        function(t, error){
                            console.log('error: ' + error.meesage);
                        });
                });

                navigator.notification.alert(
                    'All information has been saved',  // message
                     alertDismissed(),         // callback
                    'Saving',            // title
                    'Done'                  // buttonName
                );

                navigator.notification.beep(3);
            }


            function alertDismissed() {
                location.href="index.html";
            }