app.controller('ProductsCtrl', 
  ['$scope', '$mdDialog', '$rootScope', 'MapService', 'Upload', 'config', 'LocationService', 
    function($scope, $mdDialog, $rootScope, MapService, Upload, config, LocationService) {
  
      /* Product Object Definition 
      *
      * @siteNo
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

      $scope.areas = [];

      LocationService.getAreas("59a7dc2b68327").then(function(response){
        $scope.areas = response;
      });

      $scope.submitProductForm = function(){
        console.log($scope.files);
        $scope.saveProduct($scope.files);
      }

      $scope.getProducts = function(){
        MapService.getProducts().then(function(data){
          console.log(data);
        }, function(error){
          console.log(error);
        });
      }

      // upload on file select or drop
      $scope.saveProduct = function (files) {
        Upload.upload({
          url: config.apiPath + '/product',
          data: {image: files.image, symbol: files.symbol, product: $scope.product}
        }).then(function (resp) {
          console.log('Success. Product saved. Response: ', resp);
        }, function (resp) {
          console.log('Error status: ', resp);
        }, function (evt) {
          // console.log(evt);
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          console.log('progress: ' + progressPercentage + '% ' + evt.config.data.image.name);
        });
      };
    }
  ]
);