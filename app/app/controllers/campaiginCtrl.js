app.controller('campaiginController', function ($scope, $mdDialog) {

//alert("hello ctrls")
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