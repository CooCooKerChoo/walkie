$(document).on('pageshow', "#view_routes", function() {

	// $.ajax({    //create an ajax request to load_page.php
 //        type: "GET",
 //        url: "http://matt-meadows.co.uk/walkie/ajaxGET.php",             
 //        dataType: "json",   //expect html to be returned                
 //        success: function(data){                    
 //            console.log(data);
 //        },
 //        error: function(jqXHR, textStatus, errorThrown){
 //            alert(textStatus, errorThrown);
 //        }
 //    });

    $.ajax({                                      
      url: 'http://matt-meadows.co.uk/walkie/ajaxGET.php',                  //the script to call to get data          
      data: "",                        //you can insert url argumnets here to pass to api.php
      dataType: 'json',                //data format      
      success: function(data)          //on recieve of reply
      {
        console.log(data);
      }, 
        error: function(jqXHR, textStatus, errorThrown){
            alert(textStatus, errorThrown);
        }
    });
});