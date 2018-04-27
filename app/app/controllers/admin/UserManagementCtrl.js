app.controller('UserManagementCtrl', function ($scope, $http, AdminUserManagementService) {
  
  /**
   * Get Users
   */
  var getAllUsers = function(){
    AdminUserManagementService.getAllUsers().then(function(result){
      console.log(result);
      $scope.allUsers = result;
    });
  }
  getAllUsers();

  /*===================
  | Roles Section
  ===================*/

  $scope.selectedRoles = [];

  /**
   * Get Roles
   */
  var getAllRoles = function(){
    AdminUserManagementService.getAllRoles().then(function(result){
      console.log(result);
      $scope.allRoles = result;
    });
  }
  getAllRoles();

  $scope.toggleRoleSelection = function(roleId){
    if($scope.selectedRoles.indexOf(roleId) == -1){
      $scope.selectedRoles.push(roleId);
    }
    else{
      $scope.selectedRoles.pop(roleId);
    }
    console.log($scope.selectedRoles);
  }

  /*===================
  | Roles Section Ends
  ===================*/


  /*==========================
  | Permissions Section
  ==========================*/

  $scope.selectedPermissions = [];

  /**
   * Get Permissions
   */
  var getAllPermissions = function(){
    AdminUserManagementService.getAllPermissions().then(function(result){
      console.log(result);
      $scope.allPermissions = result;
    });
  }
  getAllPermissions();

  $scope.togglePermissionSelection = function(permissionId){
    if($scope.selectedPermissions.indexOf(permissionId) == -1){
      $scope.selectedPermissions.push(permissionId);
    }
    else{
      $scope.selectedPermissions.pop(permissionId);
    }
    console.log($scope.selectedPermissions);
  }

  /*==========================
  | Permissions Section Ends
  ==========================*/


});