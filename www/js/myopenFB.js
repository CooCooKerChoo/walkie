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

    function errorHandler(error) {
        alert(error.message);
    }