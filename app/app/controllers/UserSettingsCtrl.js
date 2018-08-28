app.controller("UserSettingsCtrl", function ($scope, $stateParams, $mdDialog, $rootScope, $location, UserService, toastr) {
  
  $scope.forms = [];

  if($stateParams.code){
    $scope.typeReset = true;
  }

  if($rootScope.currStateName == 'index.complete_registration'){
    $scope.userData = {};
    $scope.userData.code = $stateParams.code;
  }
  else{
    $scope.resetPwdObj = {};
    $scope.resetPwdObj.code = $stateParams.code;
  }

  
  $scope.resetPassword = function(){
    if($scope.resetPwdObj.newPassword == $scope.resetPwdObj.confirmNewPassword){
      if($scope.typeReset){
        UserService.resetPassword($scope.resetPwdObj).then(function (result) {
          showPwdChangeSuccessModal(result);
        });
      }
      else{
        UserService.changePassword($scope.resetPwdObj).then(function (result) {
          showPwdChangeSuccessModal(result);
        });
      }
    }
    else{
      toastr.error("Passwords do not match.");
    }
  }

  function showPwdChangeSuccessModal(result){
    if (result.status == 1) {
      // logging out user(in case if he has localstorage set)
      $auth.logout().then(function(result){
        $rootScope.isAuthenticated = false;
        $location.path('/');
        localStorage.clear();
      });
      $mdDialog.show({
        templateUrl: 'views/verification-success.html',
        fullscreen: $scope.customFullscreen,
        clickOutsideToClose: true,
        controller: function($scope, $location, $mdDialog){
          $scope.showLogin = function(){
            $mdDialog.hide();
            $location.path('/');
            $mdDialog.show({
              templateUrl: 'views/sign-in.html',
              fullscreen: $scope.customFullscreen,
              clickOutsideToClose:true,
              controller: 'AuthCtrl'
            });
          }
        }
      });
    }
    else {
      if(result.message.constructor === Array){
        $scope.resetPasswordErrors = result.message;
      }
      else{
        toastr.error(result.message);
      }
    }
  }

  $scope.completeUserRegistration = function(){
    UserService.completeRegistration($scope.userData).then(function(result){
      if(result.status == 1){
        toastr.success(result.message);
      }
      else{
        $scope.completeRegistrationErrors = result.message;
        $scope.forms.registerUserForm.$setInvalid();
      }
      setTimeout(()=>{
        $location.path('/');
      }, 2000);
    }, function(result){
      toastr.error(result);
    });
  }
});