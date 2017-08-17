'use strict';

app.controller('LocationCtrl', ['$scope', 'NgMap', 'MapService', function($scope, NgMap, MapService) {
  $scope.dynMarkers = [];
  $scope.mapObj;
  var trafficOn = false;
  var trafficLayer = new google.maps.TrafficLayer(); 
  NgMap.getMap().then(function(map) {
    $scope.mapObj = map;
    $scope.arrayGroup();
    $scope.mapObj.setCenter({lat: 17.3850, lng: 78.4867});
    $scope.mapObj.setZoom(17);  
  });

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
    var circleMarker = new google.maps.Marker({ 
      icon: {
        url: 'assets/images/maps/Ellipse 55.png',
        scaledSize : new google.maps.Size(55, 55),
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(27.8, 29.5) // anchor
      }, 
    });
    var oms = new OverlappingMarkerSpiderfier($scope.mapObj, { 
      markersWontMove: true, 
      markersWontHide: true,
      basicFormatEvents: true,
      circleSpiralSwitchover: Infinity,
      legWeight : 0,
      circleFootSeparation: 32,
      nearbyDistance : 1,
      keepSpiderfied : true
    });
    
    _.each(repeated_coords, function(value, key){
      for(var i = 0; i < value; i++){
        (function() {  // make a closure over the marker and marker data
          var label = {};
          label.text = " ";
          label.color = "rgba(255, 255, 255, 1)";
          if(i == 0){
            label.text = value.toString();
          }
          var ll = key.split(',');
          var icon = {
            url: 'assets/images/maps/unspidered-cluster.png',
            scaledSize : new google.maps.Size(20, 20),
            origin: new google.maps.Point(0,0), // origin
            anchor: new google.maps.Point(10, 10) // anchor
          };
          var marker = new google.maps.Marker({ 
            position: {lat: parseFloat(ll[0]), lng: parseFloat(ll[1]) }, 
            icon: icon, 
            label: label
          });
          marker.groupSize = value;
          google.maps.event.addListener(marker, 'spider_click', function(e) {  // 'spider_click', not plain 'click'
            iw.setContent("dummy text");
            iw.open($scope.mapObj, marker);
          });
          oms.addMarker(marker);  // adds the marker to the spiderfier _and_ the map
        })();
      }
    });

    // instantiate oms when click occurs on marker-group
    oms.addListener('format', function(marker, status) {
      var markerIcon;
      var label = marker.getLabel();
      var scaledCoord = 32 + (10 * (marker.groupSize-1));
      var circleMarkerIcon = {
        url : 'assets/images/maps/Ellipse 55.png',
        scaledSize : new google.maps.Size(scaledCoord, scaledCoord),
        origin : new google.maps.Point(0, 0), // origin
        anchor : new google.maps.Point(scaledCoord/2, scaledCoord/2),
      };
      if(status == OverlappingMarkerSpiderfier.markerStatus.SPIDERFIED){
        // when markers are scattered
        label.color = "rgba(255, 255, 255, 0)";
        marker.setLabel(label);
        circleMarker.setPosition(marker.getPosition());
        circleMarker.setIcon(circleMarkerIcon);
        circleMarker.setMap($scope.mapObj);
        markerIcon = {
          url: 'assets/images/maps/spidered-marker.png',
          scaledSize : new google.maps.Size(36, 36),
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(18, 18) // anchor
        };
      }
      else{
        // when markers are grouped as one
        markerIcon = {
          url: 'assets/images/maps/unspidered-cluster.png',
          scaledSize : new google.maps.Size(20, 20),
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(10, 10) // anchor
        };
        label.color = "rgba(255, 255, 255, 1)";
        marker.setLabel(label);
        // spiderCircle.setMap(null);
        circleMarker.setMap(null);
        iw.close();
      }
      marker.setIcon(markerIcon);
    });
  }

  $scope.toggleTraffic = function(){
    trafficOn = !trafficOn;
    var mapVal = null;
    if(trafficOn){
      mapVal = $scope.mapObj;
    }
    trafficLayer.setMap(mapVal);
  }
}]);