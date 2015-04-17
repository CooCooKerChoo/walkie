$("#Walk_"+walkId).on( "pagecreate", function() {
	alert("Page Loaded");
});

$("#Walk_"+walkId).on( "pageshow", function() {
	setTimeout(function() {
	    google.maps.event.trigger(map, "resize");
	}, 1000);
});