'use strict';

app.controller('LocationCtrl', ['$scope', 'NgMap', 'MapService', function($scope, NgMap, MapService) {
  $scope.dynMarkers = [];
  NgMap.getMap().then(function(map) {
    for (var i=0; i<1000; i++) {
      var latLng = new google.maps.LatLng(MapService.markers()[i].position[0], MapService.markers()[i].position[1]);
      $scope.dynMarkers.push(new google.maps.Marker({position:latLng}));
    }
    // $scope.markerClusterer = new MarkerClusterer(map, $scope.dynMarkers, {});
  });
  $scope.click = function() {
    alert(1);
  };

  $scope.firstThing = 'AAAAAAAAAAAAAA';
  $scope.otherThings = ['BBBBBBB','CCCCCCCC'];
}]);