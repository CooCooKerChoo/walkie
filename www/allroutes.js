$(document).on('pageinit', "#view-routes", function() {
		$.ajax({
			type: "POST",
	        data: dataString,
	        url: 'http://matt-meadows.co.uk/walkie/ajaxGET.php',
	        success: function(response){
	        	alert(response);
	        },
	        error: function(error){
	        	alert(error);
	        }
	    });
}