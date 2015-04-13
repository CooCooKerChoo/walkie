 $(document).on('pageinit', "#map-page", function() {

            // $("#photosContainer").mCustomScrollbar({
            //     axis:"x",
            //     theme:"dark-thick",
            //     autoExpandScrollbar:true,
            //     advanced:{autoExpandHorizontalScroll:true}
            // });

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

                for( var i = 0, c = imageArray.length; i < c; i++ ) {

                    $(".photos").append('<a href="#dialog' + i + '"data-rel="popup"><img class="image" src="' + imageArray[i] + '"></a>');

                    $("#map-page").append('<div data-role="popup" class="imagePopups" id="#popup' + i + '><a hef="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a><img class="popupphoto" src="' + imageArray[i] + '" width="300"></div>').trigger('create');

                    console.log(imageWidth, imageHeight);

                    $(".imagePopups").popup();
                }

                $( ".imagePopups" ).on({
                    popupbeforeposition: function() {
                        var maxHeight = $( window ).height() - 60 + "px";
                        $( ".imagePopups img" ).css( "max-height", maxHeight );
                    }
                });

            });



            function saveInfo() {
                var saveAllInfo = document.getElementById("walkDescription").innerText;
                localStorage.setItem("walkDescription_" + currentTrackID, saveAllInfo);
            }