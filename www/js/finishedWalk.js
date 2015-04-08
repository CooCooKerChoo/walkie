 $(document).on('pageinit', "#map-page", function() {

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

            var storedDuration = localStorage.getItem("overallTime")
            if(storedDuration) {
                document.getElementById("finalDuration").innerHTML = storedDuration;
            }

            var storedDistance = localStorage.getItem("overallDistance")
            if(storedDistance) {
                document.getElementById("finalDistance").innerHTML = storedDistance;
            }

            var imageStorage = localStorage.getItem("savedImage");
            if(imageStorage) {
                document.getElementById('image').innerHTML = "data:image/jpeg;base64," + imageStorage;    
            }

            function getPhotos() {
                navigator.camera.getPicture(onPhotosSuccess, onPhotosFail, {
                    quality: 70, 
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    mediaType: Camera.MediaType.PICTURE});
            }

            function onPhotosSuccess() {
                var image = document.getElementById('image');

                image.src = imageURI;

                image.style.display = 'block';
            }

            function onPhotosFail(message) {
                alert('Failed because: ' + message);
            }
});