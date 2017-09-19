app.controller('PricingCtrl', function($scope, $mdDialog) {

    $scope.showTabDialog = function (ev) {
        $mdDialog.show({
          templateUrl: 'views/signIn.html',
          fullscreen: $scope.customFullscreen,
          clickOutsideToClose: true
        })
      };
});