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

    function errorHandler(error) {
        alert(error.message);
    }