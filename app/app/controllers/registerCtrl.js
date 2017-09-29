"usert strict",

app.controller("registerCtrl", function ($scope, $mdDialog) {

	//alert("Registration page user and Agency skeleton and functionality implemented  ");

	$scope.UserData = {};
	$scope.AgencyData = {};

	$scope.UserData = {
		name: '', username: '', email: '', mobile: '', address: '', IsUser: '1'
	}

	$scope.registerUserSave = function (user) {
		$scope.UserData = $scope.user;
		var NewData = JSON.stringify($scope.UserData)
		//$scope.UserData = JSON.parse(NewData);
		console.log("data", $scope.UserData);
	}

	//Agency Functionolity implemented here
	$scope.AgencyData = {
		name: '', username: '', email: '', mobile: '', address: '', IsAgency: { IsAgency: '2' }
	}

	$scope.registerAgencySave = function (agency) {
		$scope.AgencyData = $scope.agency;
		var NewAgencyData = JSON.stringify($scope.AgencyData);
		//$scope.AgencyData = JSON.parse(NewAgencyData);
	}

	//form
	$scope.currentNavItem = 'users';
	$scope.userForm = true;
	$scope.agencyForm = false;
	$scope.showUserRegPanel = function(){
		$scope.userForm = true;
		// $scope.agencyForm = false;
	}
	$scope.showAgencyRegPanel= function(){
		// $scope.agencyForm = true;
		$scope.userForm = false;
	}

	$scope.close = function () {
		$mdDialog.hide();
	}
})