 $(document).on('pageshow', "#my-routes", function() {

 	db.transaction(function(t){
		t.executeSql('SELECT * FROM WALKS', [], querySuccess, errorCB);
 	});

 	function querySuccess(t, results, Element) {
		var len = results.rows.length;
		console.log("Walks table: " + len + " rows found");

		var coords = [];
		var polys = [];

	    for (var i=0; i<len; i++){
	    	var polylinePath = [];
	    	var walkId = results.rows.item(i).id;
		    var path = results.rows.item(i).PathCoordinates;
			path=path.substr(1,path.length-1);	path=path.substr(0,path.length-1); 
			var polyline = path.split("),("); 
			var sumLat=0, sumLng=0, maxLat, minLat, maxLng, minLng; 
			polyline=polyline.map(function(p){ 
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

			console.log(coords);
			console.log(polys);

            $("#my_walks").append('<div class="walk_container"><div id="map" class="walk_container"><div class="map" id="walkMap' + walkId + '" style="width: 100%; height: 200px;"></div></div>');
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