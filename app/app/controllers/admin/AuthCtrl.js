app.controller('AuthCtrl', function($scope, $auth){
  $scope.login = function () {
		$auth.login($scope.user).then(function (res) {
			if($auth.isAuthenticated()){
				$rootScope.isAuthenticated = true; 
				
			}
			else{
				console.error(res);
			}
		}).catch(function (error) {
			console.error(error.data.message, error.status);			
		});
	}
});