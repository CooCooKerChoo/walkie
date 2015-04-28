$(document).on('pageinit', "#my-routes", function() {

	Routecoords = [], Routepolys = [];

 	db.transaction(function(t){
		t.executeSql('SELECT * FROM WALKS', [], querySuccess, errorCB);
 	});

 	function querySuccess(t, results) {

	    for (var i=0; i < results.rows.length; i++){
	    	var polylinePath = [];
	    	var walkId = results.rows.item(i).walkID;
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
			Routecoords.push([sumLat/polyline.length, sumLng/polyline.length, maxLat, minLat, maxLng, minLng]);
			Routepolys.push(polyline);

            $("#my_walks").append('<a data-route="'+walkId+'" class="walkPage" href="#route_details"><span class="walk_container"><span class="map" id="walkMap' + walkId + '" style="width: 100%; height: 150px;"></span><span class="walk_basic_info"><span class="walk_title">'+ walkTitle + '</span><span class="walk_distance">' + walkDistance + '</span><span class="walk_duration">'+ "|" + walkDuration + '</span></span></a>');
	    }

		$('.map').each(function (index, Element) {
		    myOptions = {
		        zoom: 20,
		        center: new google.maps.LatLng(Routecoords[index][0],Routecoords[index][1]),
		        // center: new google.maps.LatLng(52.9544124,-2.0046446),
		        mapTypeId: google.maps.MapTypeId.TERRAIN,
		        disableDefaultUI: false,
		        mapTypeControl: false,
            	mapTypeControl: false,
                streetViewControl:false,
                zoomControl: false,
                draggable: false,
                scrollWheel: false
		    };


		    sw = new google.maps.LatLng(Routecoords[index][3],Routecoords[index][5]);
		    ne = new google.maps.LatLng(Routecoords[index][2],Routecoords[index][4]);

		    allMyRoutesMap = new google.maps.Map(Element, myOptions);

              var path = new google.maps.Polyline({
                path: Routepolys[index],
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2
              });
              path.setMap(allMyRoutesMap);
		});

 	}

 		function errorCB(error) {
 			console.log("Error processing SQL: " + error.message);
 		}
});

$(document).on("click", ".walkPage", function(){
	clicked_route = $(this).attr("data-route");
});

 $(document).on('pageshow', "#my-routes", function() {
    function getInfo() {
        openFB.api({
            path: '/me',
            success: function(data) {
                console.log(JSON.stringify(data));
                document.getElementById("userName").innerHTML = data.name;
                document.getElementById("userPic").src = 'http://graph.facebook.com/' + data.id + '/picture?type=small';
            },
            error: errorHandler});
    }

		$('.map').each(function (index, Element) {

			allMyRoutesMap.fitBounds(new google.maps.LatLngBounds(sw,ne));

	        setTimeout(function() {
	            google.maps.event.trigger(allMyRoutesMap, "resize");
	        }, 1000);
		});
});