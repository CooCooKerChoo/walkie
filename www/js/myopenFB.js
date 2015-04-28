	 openFB.init({appId: '292811390842470', tokenStore: window.localStorage});

	function login() {
	    openFB.login(
	            function(response) {
	                if(response.status === 'connected') {
	                    alert('Facebook login succeeded, got access token: ' + response.authResponse.token);
	                } else {
	                    alert('Facebook login failed: ' + response.error);
	                }
	            }, {scope: 'email,read_stream,publish_stream'});
	    getInfo();
	}

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

    function share() {
        openFB.api({
            method: 'POST',
            path: '/me/feed',
            params: {
                message: 'http://matt-meadows.co.uk/walkie/route/'+clicked_route
            },
            success: function() {
                alert('the item was posted on Facebook');
            },
            error: errorHandler});

        var dataString = 'walkID='+ routeID;

        $.ajax({
            type: "POST",
            data: dataString,
            url: 'http://matt-meadows.co.uk/walkie/createRoutePage.php',
            success: function(response){
            },
            error: function(jqXHR, textStatus, errorThrown){
                alert(textStatus, errorThrown);
            }
        });
    }

    function errorHandler(error) {
        alert(error.message);
    }