app.controller('PricingCtrl',["$scope", "$mdDialog", function($scope, $mdDialog) {

    $scope.showTabDialog = function (ev) {
        $mdDialog.show({
          templateUrl: 'views/sign-in.html',
          fullscreen: $scope.customFullscreen,
          clickOutsideToClose: true
        })
      };
}]);