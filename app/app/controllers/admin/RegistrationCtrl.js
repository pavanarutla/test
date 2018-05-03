app.controller('AdminRegistrationCtrl', function ($scope, $mdDialog, $http, $rootScope, $auth, toastr, AdminUserService) {

  $scope.msg = {};

  $scope.registrationPopup = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/admin/registration-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
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


  AdminUserService.getUsers().then(function (response) {    
   // $scope.gridUsers.data = response;
     $scope.userList = response;
     console.log($scope.userList);
  });
  
  AdminUserService.getAgencies().then(function (response) {
    $scope.agencyList = response;
  });
$scope.Useredit = function(user){
  $scope.user = user;
  $mdDialog.show({
    templateUrl: 'views/admin/registration-popup.html',
    fullscreen: $scope.customFullscreen,
    clickOutsideToClose: true,
    preserveScope: true,
    scope: $scope
  });
};
 


  /* 
  ======== Adding New User ========
  */
  $scope.addUser = function (user) {
    AdminUserService.saveUser($scope.user).then(function(result){
      if(result.status == 1){
        AdminUserService.getUsers().then(function (response) {    
          $scope.Userdata = response;
        });
        $mdDialog.hide();
        toastr.success('User has been created successfully.');
      }
      else{
        toastr.error(result.message);
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
        AdminUserService.getUsers().then(function (response) {    
          $scope.removeUsers.data = response;
        });
        $mdDialog.hide();
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
  $scope.activateUser = function(userMId){
    AdminUserService.activateUser(userMId).then(function(result){
      if(result.status == 1){
        AdminUserService.getUsers().then(function (response) {    
          $scope.activateUsers.data = response;
        });
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
  $scope.addAgency = function (agency) {
    AdminUserService.saveAgency($scope.agency).then(function(result){
      if(result.status == 1){
        AdminUserService.getAgencies().then(function (response) {    
          $scope.ADDAgency = response;
        });
        $mdDialog.hide();
        toastr.success('Agency has been successfully created.');
      }
      else{
        toastr.error(result.message);
      }
    });
  }

  /* 
  ======== Adding New Agency ends========
  */

  $scope.cancel = function () {
    $mdDialog.cancel();
  }

  // tables code start
  $scope.registPaginationLimit = 6;
  $scope.registPageIndex = 0;
  $scope.nextFeedsShow = function() {
    if ($scope.registPageIndex + $scope.registPaginationLimit < $scope.userList.length) {
      $scope.registPageIndex += $scope.registPaginationLimit;
    }
  };
  $scope.prevFeedsShow = function(){
    if ($scope.registPageIndex > 0) {
      $scope.registPageIndex -= $scope.registPaginationLimit;
    }
  }  
  
  // tables code end
  // tables code start
  $scope.loadFormatesPaginationLimit = 5;
  $scope.loadFormatesPageIndex = 0;
  $scope.nextagencyShow = function() {
    if ($scope.loadFormatesPageIndex + $scope.loadFormatesPaginationLimit < $scope.agencyList.length) {
      $scope.loadFormatesPageIndex += $scope.loadFormatesPaginationLimit;
    }
  };
  $scope.prevAgencyShow = function(){
    if ($scope.loadFormatesPageIndex > 0) {
      $scope.loadFormatesPageIndex -= $scope.loadFormatesPaginationLimit;
    }
  }
  // var vm = $scope;
  // vm.limit = 5;
  // $scope.AgencyloadMore = function() {
  //   var increamented = vm.limit + 5;
  //   vm.limit = increamented > $scope.agencyList.length ? $scope.agencyList.length : increamented;
  // };
// tables code end  
});