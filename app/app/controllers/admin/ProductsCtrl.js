app.controller('ProductsCtrl', ['$scope', '$mdDialog', 'MapService', function($scope, $mdDialog, MapService) {
  
  
  /* Product Object Definition 
  *
  * @adStrength
  * @address
  * @areaName
  * @company
  * @direction
  * @hoardingCost
  * @image
  * @impressions
  * @lat
  * @lighting
  * @lng
  * @mapSymbol
  * @panelSize
  * @type 
  */
  
  $scope.product = {};
  
  $scope.submitProductForm = function(){
    // console.log($scope.product);
    MapService.saveMarker().then(function(data){
      console.log("marker saved successfully", data);
    }, function(error){
      console.log("Could not save marker.", error);
    });
  }

  $scope.getProducts = function(){
    MapService.getMarkers().then(function(data){
      console.log(data);
    }, function(error){
      console.log(error);
    });
  }
  
}]);