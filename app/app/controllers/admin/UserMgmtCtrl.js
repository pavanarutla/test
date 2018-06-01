app.controller('UserMgmtCtrl', function ($scope, $mdDialog, $http, $rootScope, $auth, $stateParams, toastr, AdminUserService, AdminUserMgmtService) {

  $scope.msg = {};

  /*===================
  | Pagination
  ===================*/
  $scope.pagination = {};
  $scope.pagination.pageNo = 1;
  $scope.pagination.pageSize = 15;
  $scope.pagination.pageCount = 0;
  var pageLinks = 20;
  var lowest = 1;
  var highest = lowest + pageLinks - 1;
  function createPageLinks(){
    var mid = Math.ceil(pageLinks/2);
    if($scope.pagination.pageCount < $scope.pagination.pageSize){
      lowest = 1;
    }
    else if($scope.pagination.pageNo >= ($scope.pagination.pageCount - mid) && $scope.pagination.pageNo <= $scope.pagination.pageCount){
      lowest = $scope.pagination.pageCount - pageLinks;
    }
    else if($scope.pagination.pageNo > 0 && $scope.pagination.pageNo <= pageLinks/2){
      lowest = 1;
    }
    else{
      lowest = $scope.pagination.pageNo - mid + 1;
    }
    highest = $scope.pagination.pageCount < $scope.pagination.pageSize ? $scope.pagination.pageCount : lowest + pageLinks;
    $scope.pagination.pageArray = _.range(lowest, highest);
  }

  /*===================
  | Pagination Ends
  ===================*/

  $scope.registrationPopup = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/admin/registration-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      preserveScope: true,
      scope: $scope
    })
  };

  /*
  ==== checking if user has owner role ====
  */
  $scope.isUserOwner = _.indexOf(_.pluck($auth.getPayload().user.roles, "name"), "owner") != -1;
  /*
  ==== checking if user has owner role ends ====
  */

  /* 
  ==== Switching between user and agency pop up form ====
  */
  $scope.userChecked = true;

  $scope.showUser = function () {
    $scope.userChecked = true;    
  }
  $scope.showAgency = function () {
    $scope.userChecked = false;
  }
  /* 
  ==== Switching between user and agency pop up form ends ====
  */

  /* 
  ======== Users Grid ========
  */

  $scope.getUsers = function(){
    AdminUserService.getUsers($scope.pagination.pageNo, $scope.pagination.pageSize).then(function (response) {
      $scope.userList = response.users;
      $scope.pagination.pageCount = response.page_count;
    });
  }
  $scope.getUsers();

  /* 
  ======== Users Grid ends ========
  */


  /* 
  ======== Agency Grid ========
  */

  $scope.getAgencies = function(){
    AdminUserService.getAgencies().then(function (response) {
      $scope.agencyList = response;
    });
  }
  $scope.getAgencies();

  /* 
  ======== Agency Grid ends ========
  */


  /* 
  ======== Adding New User ========
  */
  $scope.addUser = function () {
    AdminUserService.saveUser($scope.user).then(function(result){
      console.log("working")
      if(result.status == 1){
        $scope.getUsers();
        $mdDialog.cancel();
        toastr.success('User has been created successfully.');
      }
      else if(result.status == 0) {
          $scope.registerUserErrors = result.message;
        }
          });
        }
  /* 
  ======== Adding New User ends ========
  */

  /* 
  ======== Deleting User ========
  */
  $scope.deleteUser = function (userMongoid) {    
    AdminUserService.deleteUser(userMongoid).then(function(result){
      if(result.status == 1){
        $scope.getUsers();
        $mdDialog.cancel();
        toastr.success(result.message);
      }
      else{
        toastr.error(result.message);
      }
    });
  }
  /* 
  ======== Deleting User ends ========
  */

  /* 
  ======== Activating New User ========
  */
  $scope.toggleActivation = function(userMId){
    AdminUserService.toggleActivationUser(userMId).then(function(result){
      if(result.status == 1){
        $scope.getUsers();
        toastr.success(result.message);
      }
      else{
        toastr.error(result.message);
      }
    });
  }
  /* 
  ======== Activating New User ends ========
  */

  /* 
  ======== Adding New Agency ========
  */
  $scope.addAgency = function () {
    AdminUserService.saveAgency($scope.agency).then(function(result){
      if(result.status == 1){
        AdminUserService.getAgencies().then(function (response) {    
          $scope.gridAgency.data = response;
        });
        $mdDialog.cancel();
        toastr.success(result.message);
      }
      else if(result.status == 0){
        $scope.addAgencyErrors = result.message;
      }
    },function(error){
      toastr.error("somthing went wrong try agin later!");
    });
  }

  /* 
  ======== Adding New Agency ends========
  */


  /**
   * Get Users
   */
  var getAllUsers = function(){
    AdminUserMgmtService.getAllUsers().then(function(result){
      $scope.allUsers = result;
    });
  }
  getAllUsers();

  /**
   * Get Users
   */
  var getAllClients = function(){
    AdminUserMgmtService.getAllClients().then(function(result){
      $scope.allClients = result;
    });
  }
  getAllClients();

  /*===================
  | Roles Section
  ===================*/

  $scope.selectedRoles = [];

  /**
   * Get Roles
   */
  var getAllRoles = function(){
    AdminUserMgmtService.getAllRoles().then(function(result){
      $scope.allRoles = result;
    });
  }
  getAllRoles();

  $scope.selectedRole = 0;
  $scope.toggleRoleSelection = function(roleId){
    if($scope.selectedRole == roleId){      
      $scope.selectedRole = 0;
      $scope.selectedPermissions = [];
    }
    else{
      $scope.selectedRole = roleId;
      getRoleDetails($scope.selectedRole);
    }
  }

  var getRoleDetails = function(roleId){
    $scope.selectedPermissions = [];
    AdminUserMgmtService.getRoleDetails(roleId).then(function(result){
      // $scope.roleDetails = result;
      _.each(result.permissions, function(permission){
        $scope.selectedPermissions.push(permission.id);
      });
    });
  }

  $scope.updatePermissionsForRole = function(){
    var permObj = {
      role_id : $scope.selectedRole,
      permissions : $scope.selectedPermissions
    };
    console.log(permObj);
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
    AdminUserMgmtService.getAllPermissions().then(function(result){
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

  $scope.cancel = function () {
    $mdDialog.cancel();
  }
});