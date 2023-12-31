app.controller("AuthCtrl", function ($scope, $mdDialog, $location, $rootScope, $auth, $state, toastr, UserService) {

	$scope.showSignin = true;
	$scope.forgotPasswordpage = false;

	$scope.user = {};
	
	$scope.signInUser = function () {		
		$auth.login($scope.user).then(function (res) {
			if ($auth.isAuthenticated()) {
                            localStorage.removeItem('loggedInUser');
				var loggedInUser = {};
				var payload = $auth.getPayload();
				var userData = payload.user;
				var userMongoData = payload.userMongo;
				loggedInUser.clientId = userData.client_id;
				loggedInUser.user_id = userMongoData.id;
                                                                                          loggedInUser.mong_id = userMongoData.client_mongo_id;
				loggedInUser.client_slug = userData.client_slug;
				loggedInUser.email = userData.email;
				loggedInUser.firstName = userMongoData.first_name;
				loggedInUser.lastName = userMongoData.last_name;
				loggedInUser.user_type = userMongoData.user_type;
                                                                                         loggedInUser.user_role = userMongoData.user_type;
				loggedInUser.avatar = userMongoData.user_avatar;
				$rootScope.isAuthenticated = true;
				$rootScope.loggedInUser = loggedInUser;
				localStorage.loggedInUser = JSON.stringify(loggedInUser);
				toastr.success('You have successfully signed in!');
				$mdDialog.hide();
				$rootScope.$emit("listeningActiveUserCampaigns")
				if($rootScope.postLoginState){
					$state.go($rootScope.postLoginState, null);
				}
				else if($auth.getPayload().userMongo.user_type == "bbi"){
					$state.go("admin.home", null);
				}
				else if($auth.getPayload().userMongo.user_type == "owner"){
					$location.path("/owner/" + payload.userMongo.client_slug + "/feeds");
				}
				else{
                                
					$state.go("index.location", null,{reload: true});
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

	// $scope.close = function(){
	// 	$mdDialog.hide();		
	// }
	
	///Agency Sign In functionolity

	$scope.userAgencyHeader = true;

	/// Register Dailog start here

	$scope.showRegisterDialog = function (ev) {
		$mdDialog.show({
			templateUrl: 'views/register.html',
			fullscreen: $scope.customFullscreen,
			clickOutsideToClose: true, 
			preserveScope: true, 
			scope: $scope,
			controller: 'RegistrationCtrl'
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
				toastr.error(result.message);
			}
		});
		$mdDialog.hide();
	}

	// $scope.close = function () {
	// 	$mdDialog.hide();
	// 	$state.reload();
	// }
})
