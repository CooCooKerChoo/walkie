$("#Walk_"+walkId).on( "pagecreate", function() {
	setTimeout(function() {
	    google.maps.event.trigger(map, "resize");
	}, 5000);
});