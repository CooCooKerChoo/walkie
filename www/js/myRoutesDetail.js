$(document).on('pagebeforeshow', "#route_details", function() {
	$(".photos").empty();

	Routecoords = [], Routepolys = [];

 	db.transaction(function(t){
		t.executeSql('SELECT * FROM WALKS WHERE walkID = "'+ clicked_route+ '"', [], querySuccessDetails, errorCBDetails);
 	});


 	function querySuccessDetails(t, results) {

		var len = results.rows.length;
		console.log("Walks table: " + len + " rows found");
    	walkTitle = results.rows.item(0).WalkTitle;
    	walkDescription = results.rows.item(0).WalkDescription;
	    walkDistance = results.rows.item(0).Distance;
	    walkDuration = results.rows.item(0).Duration;
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
		Routecoords.push([sumLat/polyline.length, sumLng/polyline.length, maxLat, minLat, maxLng, minLng]);
		Routepolys.push(polyline);

	}
	function errorCBDetails(error) {
		console.log("Error processing SQL: " + error.message);
	}

});

$(document).on('pagechange', "#route_details", function() {

	Routephotos = [], routePhotosArray = [];

 	db.transaction(function(t){
		t.executeSql('SELECT * FROM MARKERS WHERE walk_id = "'+clicked_route+'"',[], querySuccessMarkers, errorCBDetails);
		t.executeSql('SELECT Images FROM WALKS WHERE walkID = "'+ clicked_route+ '"', [], querySuccessImages, errorCBDetails);
 	});


 	function querySuccessImages(t, results) {
	    Routephotos = results.rows.item(0).Images;
	    routePhotosArray = Routephotos.split(",");

		console.log(routePhotosArray);

	    for( var i = 0, c = routePhotosArray.length; i < c; i++ ) {
	        $(".photos").append('<a href="#Imagepopup' + i + '"data-rel="popup" data-position-to="window" data-transition="fade"><img class="image" src="' + routePhotosArray[i] + '"></a>');
	        $('#route_details').append('<div data-role="popup" id="Imagepopup' + i + '" class="imagePopups" data-overlay-theme="a" data-theme="d" data-corners="false"><a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a> <img class="popphoto" src="' + routePhotosArray[i] + '" style="max-height:512px;" alt="photo, test"></div>').trigger('create');
		}
	}


	$('#headerWalkTitle').html(walkTitle);
	$('#walkTitleDetails').val(walkTitle);
	$('#walkDescriptionDetails').val(walkDescription);
	$('#finalDistanceDetails').html(walkDistance);
	$('#finalDurationDetails').html(walkDuration);

	$('#routemap').each(function (index, Element) {
		    // var latlng = new google.maps.LatLng(parseFloat(coords[0]), parseFloat(coords[1]));
		    var myOptions = {
		        zoom: 14,
		        center: new google.maps.LatLng(Routecoords[index][0],Routecoords[index][1]),
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

		    mapMyRoutes = new google.maps.Map(Element, myOptions);

	    setTimeout(function() {
	    google.maps.event.trigger(mapMyRoutes, "resize");
		}, 1000);

		    var sw = new google.maps.LatLng(Routecoords[index][3],Routecoords[index][5]);
		    var ne = new google.maps.LatLng(Routecoords[index][2],Routecoords[index][4]);
			mapMyRoutes.fitBounds(new google.maps.LatLngBounds(sw,ne));

              var path = new google.maps.Polyline({
                path: Routepolys[index],
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2
              });
              path.setMap(mapMyRoutes);
	}); 

	function querySuccessMarkers(t, results) {
	    markersArrayFinal = [];
	    var len = results.rows.length;
	    console.log("Markers table: " + len + " rows found");

	    for( var i = 0, c = results.rows.length; i < c; i++) {
	    	markersArrayFinal.push(results.rows.item(i));
	    }
	    console.log(markersArrayFinal);


	    var info_window = new google.maps.InfoWindow();

	    for (i = 0; i < markersArrayFinal.length; i++) {
	            var bridgeIcon = new google.maps.MarkerImage("img/map_markers/warning_map_marker.png", null, null, null);
	            marker = new google.maps.Marker({
	                position: new google.maps.LatLng(markersArrayFinal[i].markerLat, markersArrayFinal[i].markerLng),
	                map: mapMyRoutes,
	                icon: bridgeIcon
	            });

	            console.log(marker);


		    google.maps.event.addListener(marker, 'click', (function(marker, i) {
		    	return function() {
			    	info_window.setContent('<div id="marker-info-win" data-id="'+markersArrayFinal[i].markerid+'">' +
	            '<h3>Marker Information</h3>' +
	            '<input id="warning-title" data-text="Warning Title" value="'+markersArrayFinal[i].title+'"/>'+
	            '<i class="fa fa-pencil"></i>' +
	            '<input id="warning-additional-info" data-text="Warning Additional Information" value="'+markersArrayFinal[i].info+'"/>'+
	            '<i class="fa fa-pencil"></i>');
			        info_window.open(mapMyRoutes, this);
		    	}
		    })(marker, i));
	    }
	}
	function errorCBDetails(error) {
		console.log("Error processing SQL: " + error.message);
	}


	$("button#buttonDone").click(function() {
	 	db.transaction(function(t){
			t.executeSql('SELECT * FROM WALKS WHERE walkID = "'+ clicked_route+ '"', [], querySuccessUploadRoute, errorCBDetails);
			t.executeSql('SELECT * FROM MARKERS WHERE walk_id = "'+clicked_route+'"',[], querySuccessUploadMarkers, errorCBDetails);
	 	});
	});


	function querySuccessUploadRoute(t, results) {
		var routeID = results.rows.item(0).walkID;
    	var walkTitle = results.rows.item(0).WalkTitle;
    	var walkDescription = results.rows.item(0).WalkDescription;
	    var walkDistance = results.rows.item(0).Distance;
	    var walkDuration = results.rows.item(0).Duration;
	    var walkCoords = results.rows.item(0).PathCoordinates;

	    routeID = encodeURIComponent(routeID);
	    walkTitle = encodeURIComponent(walkTitle);
	    walkDescription = encodeURIComponent(walkDescription);
	    walkDistance = encodeURIComponent(walkDistance);
	    walkDuration = encodeURIComponent(walkDuration);
	    walkCoords = encodeURIComponent(walkCoords);

	    dataString = 'walkID='+ routeID+'&walkTitle='+walkTitle+'&walkCoords='+walkCoords+'&walkDescription='+walkDescription+'&walkDistance='+walkDistance+'&walkDuration='+walkDuration+'&userEmail='+userEmail;

	    // console.log(dataString);

	    // console.log(walkID);
	    // console.log(walkTitle);
	    // console.log(walkCoords);


		$.ajax({
			type: "POST",
	        data: dataString,
	        url: 'http://matt-meadows.co.uk/walkie/ajaxPOST.php',
	        success: function(response){
                navigator.notification.alert(
                    'All information has been uploaded successfully',  // message
                    alertDismissed,         // callback
                    'Saving',            // title
                    'Done'                  // buttonName
                );
	        },
	        error: function(jqXHR, textStatus, errorThrown){
	        	alert(textStatus, errorThrown);
	        }
	    });

	    delete dataString; 

		// for(i=0; i < routePhotosArray.length; i++) {
		// 	var options = new FileUploadOptions();
		// 	var imageURI = routePhotosArray[i];

		// 	console.log(imageURI);
		// 	options.fileKey = 'file';
		// 	options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
		// 	options.mimeType = "image/jpeg";
		// 	options.chunkedMode = false;
		// 	var params =  new Object();
		// 	options.params = params;

		// 	params.value1 = walkTitle;
		// 	params.value2 = routeID;

		// 	var ft = new FileTransfer();
		// 	ft.upload(imageURI, "http://matt-meadows.co.uk/walkie/imagesUpload.php", onUploadPhotoSuccess, onUploadPhotoError, options);
		// }

	}

	function querySuccessUploadMarkers(t, results){
			var markersUploadArray = [];

		for(var i = 0, c = results.rows.length; i < c; i++) {
			markersUploadArray.push(results.rows.item(i));
			console.log(markersUploadArray);
		}

		uploadMarkers(markersUploadArray);
	}

	function uploadMarkers(markersUploadArray) {
			for( var i = 0, c = markersUploadArray.length; i < c; i++) {

			    var markerID = encodeURIComponent(markersUploadArray[i].markerid);
			    var markerTitle = encodeURIComponent(markersUploadArray[i].title);
			    var markerInfo = encodeURIComponent(markersUploadArray[i].info);
			    var markerLat = encodeURIComponent(markersUploadArray[i].markerLat);
			    var markerLng = encodeURIComponent(markersUploadArray[i].markerLng);
			    var walkid = encodeURIComponent(markersUploadArray[i].walk_id);

			    var dataStringMarkers = 'markerid='+markerID+'&markerTitle='+markerTitle+'&markerInfo='+markerInfo+'&markerLat='+markerLat+'&markerLng='+markerLng+'&walkid='+walkid;

			    console.log(dataStringMarkers);

				$.ajax({
					type: "POST",
			        data: dataStringMarkers,
			        url: 'http://matt-meadows.co.uk/walkie/ajaxPOSTMarkers.php',
			        success: function(response){
		                navigator.notification.alert(
		                    'All markers information has been uploaded successfully',  // message
		                    alertDismissed,         // callback
		                    'Saving',            // title
		                    'Done'                  // buttonName
		                );
			        },
			        error: function(jqXHR, textStatus, errorThrown){
			        	alert(textStatus, errorThrown);
			        }
			    });

		    }

		    delete markersUploadArray;
	}



	function onUploadPhotoSuccess(r){
		// alert("Photo uploaded successfully" + r.response);
	}

	function onUploadPhotoError(error){
		// alert("Error Uploading: " + error.code);
	}

	function alertDismissed(){
	}

});