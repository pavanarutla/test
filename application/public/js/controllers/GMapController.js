app.controller('GMapCtrl', ['$scope', 'GMapSrvc', 'GMarkerSrvc', function($scope, GMapSrvc, GMarkerSrvc){
  $scope.data = "hello";
	$scope.place = {};
	$scope.placeType;
	$scope.search = function() {
			$scope.apiError = false;
			GMapSrvc.searchByType(GMapSrvc.getMapObjForLocation(17.4574, 78.3720), '5000', [$scope.placeType.toString()])
			.then(
				function(res) { // success
					angular.forEach(res, function(el, i){
						GMapSrvc.addMarker(el);
					});
				},
				function(status) { // error
					$scope.apiError = true;
					$scope.apiStatus = status;
				}
			);
	}
	
	$scope.getMarkers = function(){
		GMarkerSrvc.getMarkers().then(function(data){
			console.log(data);
		});
	}

	$scope.send = function() {
			alert($scope.place.name + ' : ' + $scope.place.lat + ', ' + $scope.place.lng);    
	}
		
}]);