 $(document).on('pageinit', "#my-routes", function() {

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
	    	walkId = results.rows.item(i).id;
	    	walkTitle = results.rows.item(i).WalkTitle;
	    	walkDescription = results.rows.item(i).WalkDescription;
	    	walkDistance = results.rows.item(i).Distance;
	    	walkDuration = results.rows.item(i).Duration;
		    path = results.rows.item(i).PathCoordinates;
			path=path.substr(1,path.length-1);	path=path.substr(0,path.length-1); 
			polyline = path.split("),("); 
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

            $("#my_walks").append('<a class="walkPage" id="walk_'+walkId+'" href="#"><span class="walk_container"><span class="map" id="walkMap' + walkId + '" style="width: 100%; height: 150px;"></span><span class="walk_basic_info"><span class="walk_title">'+ walkTitle + '</span><span class="walk_distance">' + walkDistance + '</span><span class="walk_duration">'+ "|" + walkDuration + '</span></span></a>');
 	        
 	  //       var makePage = $('<div data-role="page" id="Walk_'+walkId+'">' +
 	  //       	'<div data-role="header"><a data-rel="back"><i class="fa fa-arrow-left"></i></a>'+
 	  //       	'<h1>'+walkTitle+'</h1></div><div data-role="main" class="ui-content"><div class="finishedRouteInfo"><div class="mapDetails" style="width: 100%; height: 150px;"></div>'+
 	  //       	'<div class="ui-grid-a"><div class="ui-block-a home_btns no_border"><div class="ui-block-a finishedDistance"><i class="fa fa-map-marker"></i></div>'+
				// '<div class="ui-block-b"><p>Distance <br/><span id="finalDistance" class="value">'+walkDistance+'</span></p></div></div>'+
				// '<div class="ui-block-b home_btns"><div class="ui-block-a finishedDistance"><i class="fa fa-clock-o"></i></div>'+
				// '<div class="ui-block-b finishedDuration"><p>Duration <br/><span class="value" id="finalDuration">'+walkDuration+'</span></p></div></div><span class="horizontalSplitter"></span><div class="walkDescription">'+walkDescription+
				// '</div></div></div></div>');

    //         makePage.appendTo($.mobile.pageContainer);
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

              var path = new google.maps.Polyline({
                path: polys[index],
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 5
              });
              path.setMap(map);
		});

		setTimeout(function() {
		    google.maps.event.trigger(map, "resize");
		}, 1000);
 	}

 		function errorCB(error) {
 			console.log("Error processing SQL: " + error.message);
 		}
});

$( ".walkPage" ).click(function() {
	alert( "Handler for .click() called." );
});


$("#page_details").on("pagecontainerbeforeshow", function()
{
	$("#finalDistance").innerText = "Hello";
});