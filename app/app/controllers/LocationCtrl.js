'use strict';

app.controller('LocationCtrl', ['$scope', 'NgMap', 'MapService', function($scope, NgMap, MapService) {
  $scope.dynMarkers = [];
  $scope.mapObj;
  NgMap.getMap().then(function(map) {
    for (var i=0; i<1000; i++) {
      var latLng = new google.maps.LatLng(MapService.markers()[i].position[0], MapService.markers()[i].position[1]);
      $scope.dynMarkers.push(new google.maps.Marker({position:latLng}));
    }
    // $scope.markerClusterer = new MarkerClusterer(map, $scope.dynMarkers, {});
    $scope.mapObj = map;
    $scope.arrayGroup();
  });
  $scope.click = function() {
    alert(1);
  };
  $scope.firstThing = 'AAAAAAAAAAAAAA';
  $scope.otherThings = ['BBBBBBB','CCCCCCCC'];

  $scope.arrayGroup = function(){
    var counts = {};
    var uniq_markers = [];
    _.each(MapService.markers(), function(v, i) {
      if (counts[v.position]) {
        counts[v.position]++;
      } else {
        counts[v.position] = 1;
      }
    });
    var uniq_coords = _.pick(counts, function(value, key){
      return value == 1;
    });
    var repeated_coords = _.pick(counts, function(value, key){
      return value > 1;
    });

    /* 
    //// handling clustering ////
    */
    _.each(uniq_coords, function(value, key){
      var ll = key.split(',');
      var latLng = new google.maps.LatLng(parseFloat(ll[0]), parseFloat(ll[1]));
      uniq_markers.push(new google.maps.Marker({position:latLng}));
    });
    console.log(uniq_markers);
    var mc = {
      gridSize: 50,
      maxZoom: 15,
      imagePath: 'assets/images/maps/m'
    };
    $scope.markerClusterer = new MarkerClusterer($scope.mapObj, uniq_markers, mc);

    /*
    //// handling spiderifying ////
    */
    var iw = new google.maps.InfoWindow();
    var oms = new OverlappingMarkerSpiderfier($scope.mapObj, { 
      markersWontMove: true, 
      markersWontHide: true,
      basicFormatEvents: true,
      circleSpiralSwitchover: 6
    });
    console.log(repeated_coords);
    _.each(repeated_coords, function(value, key){
      for(var i = 0; i < value; i++){
        (function() {  // make a closure over the marker and marker data
          var ll = key.split(',');
          // var markerData = window.mapData[i];  // e.g. { lat: 50.123, lng: 0.123, text: 'XYZ' }
          var icon = {
            url: 'assets/images/maps/spidered-cluster.png',
            scaledSize : new google.maps.Size(20, 20),
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(10, 10) // anchor
          };
          var marker = new google.maps.Marker({ position: {lat: parseFloat(ll[0]), lng: parseFloat(ll[1]) }, icon: icon });  // markerData works here as a LatLngLiteral
          google.maps.event.addListener(marker, 'spider_click', function(e) {  // 'spider_click', not plain 'click'
            iw.setContent("dummy text");
            iw.open($scope.mapObj, marker);
          });
          oms.addMarker(marker);  // adds the marker to the spiderfier _and_ the map
        })();
      }
    });
    oms.addListener('format', function(marker, status) {
      var icon;
      if(status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED){
        icon = {
          url: 'assets/images/maps/unspidered-marker.png',
          scaledSize : new google.maps.Size(36, 36),
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(18, 18) // anchor
        };
      }
      else{
        icon = {
          url: 'assets/images/maps/spidered-cluster.png',
          scaledSize : new google.maps.Size(20, 20),
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(10, 10) // anchor
        };
      }
      marker.setIcon(icon);
    });
  }
}]);