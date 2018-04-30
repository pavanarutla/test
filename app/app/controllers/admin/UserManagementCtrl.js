app.controller('UserManagementCtrl', function ($scope, $http, $stateParams, AdminUserManagementService) {
  
  /**
   * Get Users
   */
  var getAllUsers = function(){
    AdminUserManagementService.getAllUsers().then(function(result){
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
  }

  var getRoleDetails = function(roleId){
    AdminUserManagementService.getRoleDetails(roleId).then(function(result){
      console.log(result);
      $scope.roleDetails = result;
    });
  }

  // if role id is set, get the role details to 
  // show on the role details page.
  if($stateParams.roleId){
    getRoleDetails($stateParams.roleId);
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
  }

  /*==========================
  | Permissions Section Ends
  ==========================*/


});