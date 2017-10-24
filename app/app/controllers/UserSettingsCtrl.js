app.controller("UserSettingsCtrl", function ($scope, $stateParams, $mdDialog, UserService) {
  
  if($stateParams.code){
    $scope.typeReset = true;
  }

  $scope.resetPwdObj = {};
  $scope.resetPwdObj.code = $stateParams.code;

  
  $scope.resetPassword = function(){
    if($scope.resetPwdObj.newPassword == $scope.resetPwdObj.confirmNewPassword){
      UserService.resetPassword($scope.resetPwdObj).then(function (result) {
        if (result.status == 1) {
          $mdDialog.show({
            templateUrl: 'views/verification-success.html',
            fullscreen: $scope.customFullscreen,
            clickOutsideToClose: true,
            controller: function($scope, $location, $mdDialog){
              $scope.showLogin = function(){
                $mdDialog.hide();
                $location.path('/');
                $mdDialog.show({
                  templateUrl: 'views/signIn.html',
                  fullscreen: true
                });
              }
            }
          });
        }
        else {
          toastr.error(result.message);
        }
      });
    }
    else{
      toastr.error("Passwords do not match.");
    }
  }
});