$("#Walk_"+walkId).on( "pagecreate", function() {
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
});

$("#Walk_"+walkId).on( "pageshow", function() {
	setTimeout(function() {
	    google.maps.event.trigger(map, "resize");
	}, 1000);
});