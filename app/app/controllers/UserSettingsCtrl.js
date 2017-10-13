app.controller("UserSettingsCtrl", function ($scope, $stateParams, UserService) {
  
  $scope.authCode = $stateParams.code;
  
  $scope.resetPwdObj = {};
  $scope.resetPassword = function(){
    console.log($scope.resetPwdObj);
    if($scope.resetPwdObj.newPassword == $scope.resetPwdObj.confirmNewPassword){
      // UserService.resetPassword($scope.resetPwdObj).then(function (result) {
      //   if (result.status == 1) {
      //     $mdDialog.show({
      //       templateUrl: 'views/verification-success.html',
      //       fullscreen: $scope.customFullscreen,
      //       clickOutsideToClose: true
      //     });
      //   }
      //   else {
      //     toastr.error(result.message);
      //   }
      // });
    }
    else{
      toastr.error("Passwords do not match.");
    }
  }
});