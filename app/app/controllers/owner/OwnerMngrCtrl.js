app.controller('OwnerMngrCtrl', function ($scope,$mdSidenav,$log) {
    // $scope.toggleLeft = buildToggler('left');
    
    // function buildToggler(navID) {
    //   return function() {
    //     // Component lookup should always be available since we are not using `ng-if`
    //     $mdSidenav(navID)
    //       .toggle()
    //       .then(function () {
    //         $log.debug("toggle " + navID + " is done");
    //       });
    //   };
    // }
    $scope.ownerSidenav = function () {
    $mdSidenav('ownerLeft').toggle();
  };

})