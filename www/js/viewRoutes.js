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
                                       //for example "id=5&parent=6"
      dataType: 'json',                //data format      
      success: function(data, response)          //on recieve of reply
      {
        var id = data[0];              //get id
        var vname = data[1];           //get name
        //--------------------------------------------------------------------
        // 3) Update html content
        //--------------------------------------------------------------------
        $('#all_walks').html("<b>id: </b>"+id+"<b> name: </b>"+vname); //Set output element html
        //recommend reading up on jquery selectors they are awesome 
        // http://api.jquery.com/category/selectors/
      }, 
      error: function(error){
      	alert(error);
      } 
    });
});