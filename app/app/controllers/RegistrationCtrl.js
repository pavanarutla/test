app.controller("RegistrationCtrl", ['$scope', '$mdDialog', 'UserService', 'toastr',function ($scope, $mdDialog, UserService, toastr) {

	/*
	* ========== Switching registration forms between User and Agency ===========
	*/
	$scope.currentNavItem = 'users';
	$scope.showUserForm = true;
	$scope.showUserRegPanel = function () {
		$scope.currentNavItem = 'users';
		$scope.showUserForm = true;
	}
	$scope.showAgencyRegPanel = function () {
		$scope.currentNavItem = 'agency';
		$scope.showUserForm = false;
	}
	/*
	* ========== Switching registration forms between User and Agency ends ===========
	*/

	/*
	* ============ User Registration ============
	*/
	$scope.user = {};
	$scope.registerNewUser = function () {
		UserService.registerUser($scope.user).then(function(result){
			if(result.status == 1){
				toastr.success(result.message);
			}
			else{
				toastr.error(result.message);
			}
		}, function(result){
			// console.log(result);
			toastr.error(result);
		});
	}
	/*
	* ============ User Registration Ends ============
	*/


	/*
	* ============ Agency Registration ============
	*/
	$scope.agency = {};
	$scope.registerNewAgency = function () {
		// console.log($scope.agency);
	}
	/*
	* ============ Agency Registration Ends ============
	*/

	$scope.close = function () {
		$mdDialog.hide();
	}

}]);