$(document).on('pageinit', "#my-routes", function() {
$.ajax({    //create an ajax request to load_page.php
        type: "GET",
        url: "http://matt-meadows.co.uk/walkie/ajaxGET.php",             
        dataType: "html",   //expect html to be returned                
        success: function(response){                    
            $("#all_walks").html(response); 
            alert(response);
        },
        error: function(error){
        	alert(error);
        }
}