app.controller("RegistrationCtrl", function ($scope, $mdDialog, UserService, CompanyService, toastr) {

	$scope.forms = {};

	/*
	* ========== Switching registration forms between User and Agency ===========
	*/
	$scope.currentNavItem = 'users';
	$scope.showUserForm = true;
	$scope.showOwnerForm = false;
	$scope.showUserRegPanel = function () {
		$scope.currentNavItem = 'users';
		$scope.showUserForm = true;
		$scope.showOwnerForm = false;
		$scope.showAgencyForm = false;
	}
	$scope.showOwnerRegPanel = function () {
		$scope.currentNavItem = 'owner';
		$scope.showUserForm = false;
		$scope.showOwnerForm = true;
		$scope.showAgencyForm = false;
	}
	$scope.showAgencyRegPanel = function () {
		$scope.currentNavItem = 'agency';
		$scope.showUserForm = false;
		$scope.showOwnerForm = false ;
		$scope.showAgencyForm = true;
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
				$mdDialog.hide();
				toastr.success(result.message);
				// if($scope.regNewUserErrors){
				// 	$scope.regNewUserErrors.length = 0;
				// }
			}
			else if(result.status == 0){
				// $scope.regNewUserErrors = result.message;
				toastr.error(result.message);
			}
		}, function(result){
			toastr.error(result);
		});
	}
	/*
	* ============ User Registration Ends ============
	*/


	/*
	* ============ Company Registration ============
	*/

	function getClientTypes(){
		CompanyService.getClientTypes().then(function(result){
			$scope.clientTypes = result;
		});
	}
	getClientTypes();

	$scope.client = {};
	$scope.registerClient = function (client) {
		CompanyService.registerClient(client).then(function(result){
			if(result.status == 1){
				$scope.forms.registerClientForm.$setUntouched();
				$scope.forms.registerClientForm.$setPristine();
				toastr.success(result.message);
				// if($scope.clientErrorMessages){
				// 	$scope.clientErrorMessages = null;
				// }
				$mdDialog.hide();
			}
			else if(result.status == 0){
				// $scope.clientErrorMessages = result.message;
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