app.controller('pricingCtrl', function($scope,$mdDialog) {

    $scope.showTabDialog = function (ev) {
        $mdDialog.show({
          templateUrl: 'views/sigIn.html',
          fullscreen: $scope.customFullscreen,
          clickOutsideToClose: true
        })
      };
});