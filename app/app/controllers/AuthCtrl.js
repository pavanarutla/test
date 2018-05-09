'user strict'
app.controller("AuthCtrl", function ($scope, $mdDialog, $location, $rootScope, $auth, $state, toastr, UserService) {

	$scope.showSignin = true;
	$scope.forgotPasswordpage = false;

	$scope.user = {};
	$scope.signInUser = function () {
		$auth.login($scope.user).then(function (res) {
			if ($auth.isAuthenticated()) {
				var userData = $auth.getPayload().user;
				_.each($auth.getPayload().userMongo, function (v, k) {
					userData[k] = v;
				});
				$rootScope.isAuthenticated = true;
				$rootScope.loggedInUser = userData;
				localStorage.isAuthenticated = true;
				localStorage.loggedInUser = JSON.stringify(userData);
				toastr.success('You have successfully signed in!');
				$mdDialog.hide();
				if($rootScope.postLoginState){
					$state.go($rootScope.postLoginState, null);
				}
				else{
					$state.go("index.location", null);
				}
			}
			else if(res.data.status == 0){
				// $scope.signInUserError = res.data.message;
				toastr.error(res.data.message);
			}
			//$mdDialog.hide();
		}).catch(function (error) {
			toastr.error(error.data.message, error.status);
			$mdDialog.hide();
		});
	}

	$scope.close = function(){
		$mdDialog.hide();		
	}
	
	///Agency Sign In functionolity

	$scope.userAgencyHeader = true;

	/// Register Dailog start here

	$scope.showRegisterDialog = function (ev) {
		$mdDialog.show({
			templateUrl: 'views/register.html',
			fullscreen: $scope.customFullscreen,
			clickOutsideToClose: true
		})
	};

	$scope.showForgotPasswordDialog = function () {
		// $scope.userForm = false;
		$scope.forgotPasswordpage = true;
		// $scope.agencyForm = false;
		// $scope.userAgencyHeader = false;
	}
	//form
	$scope.currentNavItem = 'users';
	$scope.userForm = true;
	$scope.agencyForm = false;
	$scope.users = function () {
		$scope.userForm = true;
		$scope.agencyForm = false;
		$scope.forgotPasswordpage = false;
	}
	$scope.agency = function () {
		$scope.agencyForm = true;
		$scope.userForm = false;
		$scope.forgotPasswordpage = false;
	}

	$scope.requestResetPassword = function(forgotPwd){
		var sendObj = {
			email : forgotPwd.email
		};
		UserService.requestResetPassword(sendObj).then(function(result){
			if(result.status == 1){
				// $scope.passwordEmailSentSuccess = true;
				toastr.success(result.message);
			}
			else{
				toastr.error(result.error);
			}
		});
	}

	$scope.close = function () {
		$mdDialog.hide();
		$state.reload();
	}
})
