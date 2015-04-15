 $(document).on('pageinit', "#my-routes", function() {

 	db.transaction(function(t){
		t.executeSql('SELECT * FROM WALKS', [], function (t, results) {
		       console.log('Loaded all items');
		   }, function(t, error) {
		       console.log("error: " + error.message);
		   });
 	});

});