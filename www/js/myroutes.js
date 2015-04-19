 $(document).on('pageinit', "#my-routes", function() {

 	db.transaction(function(t){
		t.executeSql('SELECT * FROM WALKS', [], querySuccess, errorCB);
 	});

 	function querySuccess(t, results) {
		var len = results.rows.length;
		console.log("Walks table: " + len + " rows found");

		var coords = [];
		var polys = [];


	    for (var i=0; i<len; i++){
	    	var polylinePath = [];
	    	var walkId = results.rows.item(i).id;
	    	var walkTitle = results.rows.item(i).WalkTitle;
	    	var walkDistance = results.rows.item(i).Distance;
	    	var walkDuration = results.rows.item(i).Duration;
		    var path = results.rows.item(i).PathCoordinates;
			var path=path.substr(1,path.length-1);	path=path.substr(0,path.length-1); 
			var polyline = path.split("),("); 
			var sumLat=0, sumLng=0, maxLat, minLat, maxLng, minLng; 
			var polyline=polyline.map(function(p){ 
				var point=p.split(','); 
				// var lat=(Math.random()/100) ,lng=(Math.random()/100); 
				var lat=parseFloat(point[0]) ,lng=parseFloat(point[1]); 
				if(maxLat===undefined || maxLat<lat) maxLat=lat;
				if(maxLng===undefined || maxLng<lng) maxLng=lng;
				if(minLat===undefined || minLat>lat) minLat=lat;
				if(minLng===undefined || minLng>lng) minLng=lng;
				sumLat+=lat; sumLng+=lng; 
				return new google.maps.LatLng(lat,lng); 
			});
			coords.push([sumLat/polyline.length, sumLng/polyline.length, maxLat, minLat, maxLng, minLng]);
			polys.push(polyline);

            $("#my_walks").append('<a data-route="'+walkId+'" class="walkPage" href="#route_details"><span class="walk_container"><span class="map" id="walkMap' + walkId + '" style="width: 100%; height: 150px;"></span><span class="walk_basic_info"><span class="walk_title">'+ walkTitle + '</span><span class="walk_distance">' + walkDistance + '</span><span class="walk_duration">'+ "|" + walkDuration + '</span></span></a>');
	    }
		$('.map').each(function (index, Element) {
		    // var latlng = new google.maps.LatLng(parseFloat(coords[0]), parseFloat(coords[1]));
		    var myOptions = {
		        zoom: 14,
		        center: new google.maps.LatLng(coords[index][0],coords[index][1]),
		        // center: new google.maps.LatLng(52.9544124,-2.0046446),
		        mapTypeId: google.maps.MapTypeId.TERRAIN,
		        disableDefaultUI: false,
		        mapTypeControl: true,
            	mapTypeControl: false,
                streetViewControl:false,
                zoomControl: false,
                draggable: false,
		        zoomControlOptions: {
		            style: google.maps.ZoomControlStyle.SMALL
		        }
		    };

		    var map = new google.maps.Map(Element, myOptions);


		    var sw = new google.maps.LatLng(coords[index][3],coords[index][5]);
		    var ne = new google.maps.LatLng(coords[index][2],coords[index][4]);
			map.fitBounds(new google.maps.LatLngBounds(sw,ne));

	        setTimeout(function() {
	            google.maps.event.trigger(map, "resize");
	        }, 1000);

              var path = new google.maps.Polyline({
                path: polys[index],
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 5
              });
              path.setMap(map);
		});

 	}

 		function errorCB(error) {
 			console.log("Error processing SQL: " + error.message);
 		}
});

$(document).on("click", ".walkPage", function(){
	clicked_route = parseInt($(this).attr("data-route"));
});


$(document).on('pageshow', "#route_details", function() {

 	db.transaction(function(t){
		t.executeSql('SELECT * FROM WALKS WHERE id = "'+ clicked_route+ '"', [], querySuccessDetails, errorCBDetails);
 	});


 	function querySuccessDetails(t, results) {
		var coords = [];
		var polys = [];
		var Images = [];

		var len = results.rows.length;
		console.log("Walks table: " + len + " rows found");
    	var walkTitle = results.rows.item(0).WalkTitle;
    	var walkDescription = results.rows.item(0).WalkDescription;
	    var walkDistance = results.rows.item(0).Distance;
	    var walkDuration = results.rows.item(0).Duration;
	    var photos = results.rows.item(0).Images;
	    console.log(photos);
	    var routePhotos = photos.split(",");
	    console.log(routePhotos);
            for( var i = 0, c = routePhotos.length; i < c; i++ ) {

                $(".photos").append('<a href="#popup' + i + '"data-rel="popup" data-position-to="window" data-transition="fade"><img class="image" src="' + routePhotos[i] + '"></a>');
                $('#route_details').append('<div data-role="popup" id="popup' + i + '" class="imagePopups" data-overlay-theme="a" data-theme="d" data-corners="false"><a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a> <img class="popphoto" src="' + routePhotos[i] + '" style="max-height:512px;" alt="photo, test"></div>').trigger('create');

			}
		var path = results.rows.item(0).PathCoordinates;
		var path=path.substr(1,path.length-1);	path=path.substr(0,path.length-1); 
		var polyline = path.split("),("); 
		var sumLat=0, sumLng=0, maxLat, minLat, maxLng, minLng; 
		var polyline=polyline.map(function(p){ 
			var point=p.split(','); 
			// var lat=(Math.random()/100) ,lng=(Math.random()/100); 
			var lat=parseFloat(point[0]) ,lng=parseFloat(point[1]); 
			if(maxLat===undefined || maxLat<lat) maxLat=lat;
			if(maxLng===undefined || maxLng<lng) maxLng=lng;
			if(minLat===undefined || minLat>lat) minLat=lat;
			if(minLng===undefined || minLng>lng) minLng=lng;
			sumLat+=lat; sumLng+=lng; 
			return new google.maps.LatLng(lat,lng); 
		});
		coords.push([sumLat/polyline.length, sumLng/polyline.length, maxLat, minLat, maxLng, minLng]);
		polys.push(polyline);
			
		$('#headerWalkTitle').html(walkTitle);
		$('#walkTitleDetails').val(walkTitle);
		$('#walkDescriptionDetails').val(walkDescription);
		$('#finalDistanceDetails').html(walkDistance);
		$('#finalDurationDetails').html(walkDuration);

// var latlng = new google.maps.LatLng(parseFloat(coords[0]), parseFloat(coords[1]));
		    var myOptions = {
		        zoom: 14,
		        center: new google.maps.LatLng(coords[0],coords[1]),
		        // center: new google.maps.LatLng(52.9544124,-2.0046446),
		        mapTypeId: google.maps.MapTypeId.TERRAIN,
		        disableDefaultUI: false,
		        mapTypeControl: true,
            	mapTypeControl: false,
                streetViewControl:false,
                zoomControl: false,
                draggable: false,
		        zoomControlOptions: {
		            style: google.maps.ZoomControlStyle.SMALL
		        }
		    };

		    var map = new google.maps.Map("#routemap", myOptions);
		    var mapPopup = new google.maps.Map("#routePopupMap", myOptions);


		    var sw = new google.maps.LatLng(coords[3],coords[5]);
		    var ne = new google.maps.LatLng(coords[2],coords[4]);
			map.fitBounds(new google.maps.LatLngBounds(sw,ne));
			mapPopup.fitBounds(new google.maps.LatLngBounds(sw,ne));

	        setTimeout(function() {
	            google.maps.event.trigger(map, "resize");
	        }, 1000);

              var path = new google.maps.Polyline({
                path: polys,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 5
              });
              path.setMap(map);
			  path.setMap(mapPopup);

	}

	function errorCBDetails(error) {
		console.log("Error processing SQL: " + error.message);
	}

});