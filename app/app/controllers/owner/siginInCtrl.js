app.controller('ownerSigninCtrl', function ($scope,$mdDialog,$mdSidenav, $auth,toastr,$state,$rootScope) {

    if(!localStorage.isOwnerAuthenticated){
    	$state.go("OwnersignIn");
    }else{
		$state.go("owner.home", null);
	}			
	
	$scope.user = {};
	$scope.signInUser = function () {
		console.log($scope.user);
		$auth.login($scope.user).then(function (res) {
			if ($auth.isAuthenticated()) {
				var userData = $auth.getPayload().user;
				console.log(userData);
				_.each($auth.getPayload().userMongo, function (v, k) {
					userData[k] = v;
				});
				localStorage.isOwnerAuthenticated = true;
				localStorage.OwnerloggedInUser = JSON.stringify(userData);
				toastr.success('You have successfully signed in!');
				if($rootScope.OwnerpostLoginState){
					$state.go($rootScope.OwnerpostLoginState, null);
				}
				else{
					$state.go("owner.home", null);
				}
			}
			else {
				toastr.error(res.data.message);
			}
			$mdDialog.hide();
		}).catch(function (error) {
			toastr.error(error.data.message, error.status);
			$mdDialog.hide();
		});
	}


});