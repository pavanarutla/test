app.controller('UserManagementCtrl', function ($scope, $http, AdminUserManagementService) {
  
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
});