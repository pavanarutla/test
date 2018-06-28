// angular.module('myApp', ['googlechart'])
  app.controller('OwnerHomeController', function($scope,$mdSidenav) {
   
    $scope.addPaymentDetalis = function() {
      $mdSidenav('upadtePaymentDetails').toggle();
    };
  
  });