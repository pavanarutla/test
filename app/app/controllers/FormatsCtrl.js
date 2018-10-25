app.controller('FormatsCtrl', function ($scope,$rootScope,$mdSidenav) {

  if($rootScope.formatSelected){
    $scope.selectedFormatIndex = $rootScope.formatSelected;
  }
  else{
    $scope.selectedFormatIndex = 0;
  }
  $scope.productview = function () {
    $mdSidenav('productDetailsList').toggle();
  };


  $scope.savecampagin = false;
  $scope.saveCampagin = function () {
      $scope.savecampagin = !$scope.savecampagin;
  }
});
