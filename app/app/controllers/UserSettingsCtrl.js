app.controller("UserSettingsCtrl",['$scope', '$stateParams', '$mdDialog', 'UserService', 'toastr', function ($scope, $stateParams, $mdDialog, UserService, toastr) {
  
  if($stateParams.code){
    $scope.typeReset = true;
  }

  $scope.resetPwdObj = {};
  $scope.resetPwdObj.code = $stateParams.code;

  
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
  }
}]);