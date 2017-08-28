app.controller('ProductsCtrl', ['$scope', '$mdDialog', '$rootScope', 'MapService', 'Upload', 'config', function($scope, $mdDialog, $rootScope, MapService, Upload, config) {
  
  
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
    // prepare data with files and upload
    // if ($scope.file.image.$valid && $scope.file.image
    //   || $scope.file.symbol.$valid && $scope.file.symbol) {
    console.log($scope.files);
    $scope.saveMarker($scope.files);
    // }
    // console.log($scope.file);
    // MapService.saveMarker().then(function(data){
    //   console.log("marker saved successfully", data);
    // }, function(error){
    //   console.log("Could not save marker.", error);
    // });
  }

  $scope.getProducts = function(){
    MapService.getMarkers().then(function(data){
      console.log(data);
    }, function(error){
      console.log(error);
    });
  }

  // $scope.submit = function() {
  //   if ($scope.form.file.image.$valid && $scope.file.image
  //     || $scope.form.file.symbol.$valid && $scope.file.symbol) {
  //     $scope.upload($scope.file);
  //   }
  // };

  // upload on file select or drop
  $scope.saveMarker = function (files) {
      Upload.upload({
        url: config.apiPath + '/marker',
        data: {image: files.image, symbol: files.symbol, product: $scope.product}
      }).then(function (resp) {
        console.log('Success. Marker saved. Response: ', resp);
      }, function (resp) {
        console.log('Error status: ' + resp);
      }, function (evt) {
        // console.log(evt);
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.image.name);
      });
  };
  
}]);