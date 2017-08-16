'use strict';

app.controller('LocationCtrl', ['$scope', 'NgMap', function($scope, NgMap) {
  NgMap.getMap().then(function(map) {
    console.log(map.getCenter());
    console.log('markers', map.markers);
    console.log('shapes', map.shapes);
  });
  $scope.click = function() {
    alert(1);
  };

  $scope.firstThing = 'AAAAAAAAAAAAAA';
  $scope.otherThings = ['BBBBBBB','CCCCCCCC'];
}]);