app.controller("RegistrationCtrl", function ($scope, $mdDialog, UserService, toastr) {

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
	* ============ Company Registration ============
	*/

	$scope.companyTypes = [
		{id: 1, name: "owner"},
		{id: 2, name: "agency"}
	];
	$scope.company = {};
	$scope.registerNewCompany = function () {
		UserService.registerCompany($scope.company).then(function(result){
			if(result.status == 1){
				toastr.success(result.message);
			}
			else{
				toastr.error(result.message);
			}
		});
	}
	/*
	* ============ Company Registration Ends ============
	*/

	$scope.close = function () {
		$mdDialog.hide();
	}

});