'user strict'
app.controller("signInCtrl", function ($scope, $mdDialog, $location, $rootScope, $auth, toastr) {

	$scope.signInpageshow = true;
	$scope.forgotPasswordpage = false;

	$scope.signInUser = function () {
		$auth.login($scope.user).then(function (res) {
			if($auth.isAuthenticated()){
				$rootScope.isAuthenticated = true;
				var userObj = $auth.getPayload();
				$rootScope.user = userObj.user;
				toastr.success('You have successfully signed in!');
			}
			else{
				toastr.error(res.data.message);
			}
			$mdDialog.hide();
		}).catch(function (error) {
			toastr.error(error.data.message, error.status);
			$mdDialog.hide();
		});
	}

	///Agency Sign In functionolity

	$scope.signInAgency = function (agency) {

		$scope.data = agency;
		if (agency.email == "naresh@gmail.com" && agency.password == "naresh123") {
			alert("login successfull")
		} else {
			alert("wrong credentials");
		}
	}


	/// Register Dailog start here

	$scope.showRegisterDialog = function (ev) {
		$mdDialog.show({
			templateUrl: 'views/register.html',
			fullscreen: $scope.customFullscreen,
			clickOutsideToClose: true
		})
	};

	$scope.showForgotPasswordDialog = function () {
		$scope.signInpageshow = false;
		$scope.forgotPasswordpage = true;
	}

})
