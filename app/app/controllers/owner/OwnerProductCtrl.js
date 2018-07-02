app.controller('OwnerProductCtrl', function ($scope, $mdDialog, $mdSidenav, $stateParams, $rootScope, OwnerProductService, OwnerLocationService, Upload, toastr) {

  /*===================
  | Sidenavs and popups
  ===================*/

  $scope.toggleRequestHoardingFormSidenav = function () {
    $mdSidenav('request-hoarding-sidenav').toggle();
  };

  $scope.openScreen = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/owner/requesthoardingadd.html',
      clickOutsideToClose: true,
    });
  };

  $scope.viewImage = function () {
    $mdDialog.show({
      templateUrl: 'views/owner/view-image.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };

  /*========================
  | Sidenavs and popups ends
  ========================*/

  /*===================
  | Pagination
  ===================*/
  $scope.pagination = {};
  $scope.pagination.pageNo = 1;
  $scope.pagination.pageSize = 15;
  $scope.pagination.pageCount = 0;
  var pageLinks = 20;
  var lowest = 1;
  var highest = lowest + pageLinks - 1;
  function createPageLinks(){
    var mid = Math.ceil(pageLinks/2);
    if($scope.pagination.pageCount < $scope.pagination.pageSize){
      lowest = 1;
    }
    else if($scope.pagination.pageNo >= ($scope.pagination.pageCount - mid) && $scope.pagination.pageNo <= $scope.pagination.pageCount){
      lowest = $scope.pagination.pageCount - pageLinks;
    }
    else if($scope.pagination.pageNo > 0 && $scope.pagination.pageNo <= pageLinks/2){
      lowest = 1;
    }
    else{
      lowest = $scope.pagination.pageNo - mid + 1;
    }
    highest = $scope.pagination.pageCount < $scope.pagination.pageSize ? $scope.pagination.pageCount : lowest + pageLinks;
    $scope.pagination.pageArray = _.range(lowest, highest);
  }

  /*===================
  | Pagination Ends
  ===================*/

  var getFormatList = function(){
    OwnerProductService.getFormatList().then(function(result){
      $scope.formatList = result;
    });
  }
  getFormatList();

  var getCountryList = function(){
    OwnerLocationService.getCountries().then(function(result){
      $scope.countryList = result;
    });
  }
  getCountryList();

  var getApprovedProductList = function(){
    OwnerProductService.getApprovedProductList($scope.pagination.pageNo, $scope.pagination.pageSize).then(function(result){
      $scope.productList = result.products;
      $scope.pagination.pageCount = result.page_count;
      createPageLinks();
    });
  }
  if($rootScope.currStateName == 'owner.hoarding-list'){
    getApprovedProductList();
  }

  var getRequestedProductList = function(){
    OwnerProductService.getRequestedProductList($scope.pagination.pageNo, $scope.pagination.pageSize).then(function(result){
      $scope.requestedProductList = result.products;
      $scope.pagination.pageCount = result.page_count;
      createPageLinks();
    });
  }
  if($rootScope.currStateName == 'owner.requested-hoardings'){
    getRequestedProductList();
  }

  $scope.getStateList = function(product){
    OwnerLocationService.getStates($scope.product.country).then(function(result){
      $scope.stateList = result;
    });
  }
  $scope.getCityList = function(){
    OwnerLocationService.getCities($scope.product.state).then(function(result){
      $scope.cityList = result;
    });
  }
  $scope.getAreaList = function(){
    OwnerLocationService.getAreas($scope.product.city).then(function(result){
      $scope.areaList = result;
    });
  }

  /*=====================
  | Product Section
  =====================*/
  $scope.product = {};
 
  $scope.files = {};
  $scope.requestAddProduct = function () {
    Upload.upload({
      url: config.apiPath + '/request-owner-product-addition',
      data: { image: $scope.files.image, product: $scope.product }
    }).then(function (result) {
      if(result.data.status == "1"){
        getRequestedProductList();
        toastr.success(result.data.message);
        $scope.toggleRequestHoardingFormSidenav();
      }
      else if(result.data.status == 0){
        $scope.requestProductErrors = result.data.errors;
      }
    }, function (resp) {
      console.log('Error status: ', resp);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.image.name);
    });
  };

  var getOwnerProductDetails = function(productId){
    OwnerProductService.getOwnerProductDetails(productId).then(function(result){
      $scope.productDetails = result;
      $scope.runningCampaignDetails = _.filter(result.campaigns, function(c){
        return c.status == 6;
      })[0];
      $scope.nonRunningCampaigns = _.filter(result.campaigns, function(c){
        return c.status != 6;
      });
    });
  }

  /*=====================
  | Product Section Ends
  =====================*/


  /*=========================
  | Page based initial loads
  =========================*/

  if($rootScope.currStateName == "owner.product-details"){
    if(typeof $stateParams.productId !== 'undefined'){
      getOwnerProductDetails($stateParams.productId); 
    }
    else{
      toastr.error("Product not found.");
    }
  }

  /*=============================
  | Page based initial loads end
  =============================*/

});