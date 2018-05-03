app.controller('ProductCtrl', ['$scope', '$mdDialog', '$http', '$stateParams', 'ProductService', 'AdminLocationService', 'CompanyService', 'config', 'Upload', 'toastr',function ($scope, $mdDialog, $http,  $stateParams, ProductService, AdminLocationService, CompanyService, config, Upload, toastr) {

  var vm = this;
  $scope.msg = {};
  $scope.countryList = [];
  $scope.stateList = [];
  $scope.cityList = [];
  $scope.areaList = [];
  $scope.hoardingCompaniesList = [];

  if($stateParams.productId){
    var productId = $stateParams.productId;
    ProductService.getProductDetails(productId).then(function(result){  
      console.log(result);
      $scope.productDetails = result.product_details;
     $scope.runningcampaignsDetails = result.running_campaign_details;
     $scope.campaignsDetails = result.campaigns_with_product;
    });
  }

  $scope.test = "test";
  /*
  ======== Formats section ========
  */

  // Opens the format form pop up
  $scope.showFormatForm = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/admin/add-format-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      preserveScope: true,
      scope: $scope
    })
  };

  // Get Formats list
  ProductService.getFormatList().then(function(result){
    //$scope.gridFormats.data = result;
    $scope.formatList = result;
    console.log($scope.formatList,"$scope.formatList");
  });

  $scope.format = {};
  $scope.addFormat = function () {
    Upload.upload({
      url: config.apiPath + '/format',
      data: {image: $scope.files.image, format: $scope.format}
    }).then(function (result) {
      if(result.data.status == 1){
        ProductService.getFormatList().then(function(result){
          $scope.formatList = result;
        });
        toastr.success(result.data.message);
      }
      else{
        toastr.error(result.data.message);
      }
        $mdDialog.cancel();
    }, function (resp) {
      // console.log('Error status: ', resp);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.image.name);
    });
  };

  $scope.editFormat = function(format){
    // console.log(format);
    $scope.format = format;
    $mdDialog.show({
      templateUrl: 'views/admin/add-format-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      preserveScope: true,
      scope: $scope
    });
  }
  $scope.cancel = function() {
    $mdDialog.cancel();
   };
  $scope.deleteFormat = function(format){
    ProductService.deleteFormat(format.id).then(function(result){
      if(result.status == 1){
        // var index = $scope.gridFormats.data.indexOf(format);
        // $scope.gridFormats.data.splice(index, 1);
        toastr.success(result.message);
      }
      else{
        toastr.error(result.message);
      }
    });
  }
  /*
  ======== Formats section ends ========
  */

  AdminLocationService.getCountries().then(function(result){
    $scope.countryList = result;

  });
  CompanyService.getHoardingCompanies().then(function(result){
    $scope.hoardingCompaniesList = result;
  });

  $scope.getStateList = function(){
    
      console.log("$scope.product.country",$scope.product.country)
    
    AdminLocationService.getStates($scope.product.country).then(function(result){
      $scope.stateList = result;
      console.log("$scope.stateList",$scope.stateList)
    });
  }
  $scope.getCityList = function(){
    AdminLocationService.getCities($scope.product.state).then(function(result){
      $scope.cityList = result;
    });
  }
  $scope.getAreaList = function(){
    AdminLocationService.getAreas($scope.product.city).then(function(result){
      $scope.areaList = result;
    });
  }
  
  /*
  ======== Products section ========
  */

  // Opens the product form popup
  $scope.showProductForm = function (ev) {
    $scope.product = {};
    $mdDialog.show({
      templateUrl: 'views/admin/add-product-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      preserveScope: true,
      scope: $scope
    })
  };
  
  // UI-Grid for products
  // 
  $scope.gridProducts = {
    paginationPageSizes: [25, 50, 75],
    paginationPageSize: 25,
    enableCellEditOnFocus: false,
    multiSelect: false,
    enableFiltering: true,
    enableSorting: true,
    showColumnMenu: false,
    enableGridMenu: true,
    enableRowSelection: true,
    enableRowHeaderSelection: false,
  };

  // Get products list
  ProductService.getProductList().then(function(result){
    //$scope.gridProducts.data = result;   
    $scope.hoardinglistdata = result; 
  });

  function getProductList(){
    ProductService.getProductList().then(function(result){
      $scope.gridProducts.data = result;
    });
  }

  $scope.product = {};
 
  $scope.files = {};
  $scope.addProduct = function () {
    Upload.upload({
      url: config.apiPath + '/product',
      data: { image: $scope.files.image, symbol: $scope.files.symbol, product: $scope.product }
    }).then(function (result) {
      if(result.data.status == "1"){
        ProductService.getProductList().then(function(result){
          $scope.gridProducts.data = result;
        });
        toastr.success(result.data.message);
      }
      else{
        toastr.error(result.data.message);
      }
    }, function (resp) {
      // console.log('Error status: ', resp);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.image.name);
    });
  };

  $scope.editProduct = function(product){
    //console.log(product);
    product.country = null;
    product.state = null;
    product.city = null;
    product.area = null;
    // product.company = null;
    $scope.product = product;
    $mdDialog.show({
      templateUrl: 'views/admin/add-product-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      preserveScope: true,
      scope: $scope
    });
  }

  $scope.deleteProduct = function(product){
    ProductService.deleteProduct(product.id).then(function(result){
      if(result.status == 1){
        // var index = $scope.gridProducts.data.indexOf(product);
        // $scope.gridProducts.data.splice(index, 1);
        toastr.success(result.message);
      }
      else{
        toastr.error(result.message);
      }
    });
  }

  /*
  ======== Products section ends ========
  */
 
  $scope.cancel = function () {
    $mdDialog.cancel();
  };

    // tables code start
    $scope.loadHoardingPaginationLimit = 5;
    $scope.loadHordingPageIndex = 0;
    $scope.loadHording = function() {
      if ($scope.loadHordingPageIndex + $scope.loadHoardingPaginationLimit < $scope.hoardinglistdata.length) {
        $scope.loadHordingPageIndex += $scope.loadHoardingPaginationLimit;
      }
    };
    $scope.PrevHoradingloadMore = function(){
      if ($scope.loadHordingPageIndex > 0) {
        $scope.loadHordingPageIndex -= $scope.loadHoardingPaginationLimit;
      }
    }
  // tables code end
   // tables code start
   $scope.loadAgencyPaginationLimit = 5;
   $scope.loadAgencyPageIndex = 0;
   $scope.nextagencyShow = function() {
     if ($scope.loadAgencyPageIndex + $scope.loadAgencyPaginationLimit < $scope.formatList.length) {
       $scope.loadAgencyPageIndex += $scope.loadAgencyPaginationLimit;
     }
   };
   $scope.prevAgencyShow = function(){
     if ($scope.loadAgencyPageIndex > 0) {
       $scope.loadAgencyPageIndex -= $scope.loadFormatesPaginationLimit;
     }
   }
 // tables code end
}]);