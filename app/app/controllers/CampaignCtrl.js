app.controller('CampaignController', function ($scope, $mdDialog) {

  $scope.showPaymentdailog = function () {	
    $mdDialog.show({
      templateUrl: 'views/updatepaymentDailog.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };

  $scope.cancel = function () {
    $mdDialog.cancel();
  };
  
});