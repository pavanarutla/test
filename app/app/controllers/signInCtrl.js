'user strict'
app.controller("signInCtrl", function ($scope, $mdDialog, $location, $rootScope, $auth, toastr) {

	$scope.showSignin = true;
	$scope.forgotPasswordpage = false;

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
				$location.path('/location');
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

	$scope.close = function(){
		$mdDialog.hide();
	}
	///Agency Sign In functionolity

	$scope.signInAgency = function () {	
		// console.log($scope.agency,"agencyLogin");
		// $auth.login($scope.agency).then(function (res) {
		// 	if ($auth.isAuthenticated()) {
		// 		var agencyData = $auth.getPayload().agency;
		// 		_.each($auth.getPayload().userMongo, function (v, k) {
		// 			userData[k] = v;
		// 		});
		// 		$rootScope.isAuthenticated = true;
		// 		$rootScope.loggedInUser = agencyData;
		// 		localStorage.isAuthenticated = true;
		// 		localStorage.loggedInUser = JSON.stringify(agencyData);
		// 		toastr.success('You have successfully signed in!');
		// 		$location.path('/location');
		// 	}
		// 	else {
		// 		toastr.error(res.data.message);
		// 	}
		// 	$mdDialog.hide();
		// }).catch(function (error) {
		// 	toastr.error(error.data.message, error.status);
		// 	$mdDialog.hide();
		// });
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
		$scope.userForm = false;
		$scope.forgotPasswordpage = true;
		$scope.agencyForm = false;
	}
	//form
	$scope.currentNavItem = 'users';
	$scope.userForm = true;
	$scope.agencyForm = false;
	$scope.users = function(){
		$scope.userForm = true;
		$scope.agencyForm = false;
		$scope.forgotPasswordpage = false;
	}
	$scope.agency= function(){
		$scope.agencyForm = true;
		$scope.userForm = false;
		$scope.forgotPasswordpage = false;
	}
})
