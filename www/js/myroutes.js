 $(document).on('pageinit', "#my-routes", function() {

 	db.transaction(function(t){
		t.executeSql('SELECT * FROM WALKS', [], querySuccess, errorCB);
 	});

 	function querySuccess(t, results, Element) {
		var len = results.rows.length;
		console.log("Walks table: " + len + " rows found");

	    for (var i=0; i<len; i++){
	    	walkId = results.rows.item(i).id;
		    coords = results.rows.item(i).PathCoordinates;
		    coords.slice(2);
		    console.log(coords);
            $("#my_walks").append('<div class="walk_container"><div class="map" id="walkMap' + walkId + '"></div>');
	    }
		$('.map').each(function (index, Element) {
		    // var latlng = new google.maps.LatLng(parseFloat(coords[0]), parseFloat(coords[1]));
		    var myOptions = {
		        zoom: parseFloat(coords[2]),
		        // center: latlng,
		        mapTypeId: google.maps.MapTypeId.ROADMAP,
		        disableDefaultUI: false,
		        mapTypeControl: true,
		        zoomControl: true,
		        zoomControlOptions: {
		            style: google.maps.ZoomControlStyle.SMALL
		        }
		    };
		    var map = new google.maps.Map(Element, myOptions);

		    var marker = new google.maps.Marker({
		        // position: latlng,
		        map: map
		    });
		});
 	}

 		function errorCB(error) {
 			console.log("Error processing SQL: " + error.message);
 		}

});