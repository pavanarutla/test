app.controller('OwnerProductCtrl', function ($scope, $mdDialog, $mdSidenav, $window, OwnerProductService, OwnerLocationService) {

  /*==============
  | Sidenavs
  ==============*/

  $scope.toggleRequestHoardingFormSidenav = function () {
    $mdSidenav('request-hoarding-sidenav').toggle();
  };

  /*===============
  | Sidenavs ends
  ===============*/

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

  var getProductList = function(){
    OwnerProductService.getApprovedProductList($scope.pagination.pageNo, $scope.pagination.pageSize).then(function(result){
      $scope.productList = result.products;
      $scope.pagination.pageCount = result.page_count;
      createPageLinks();
    });
  }
  getProductList();

  /*=====================
  | Product Section
  =====================*/
  $scope.product = {};
 
  $scope.files = {};
  $scope.requestAddProduct = function () {
    // console.log($scope.files);
    // console.log($scope.product);
    Upload.upload({
      url: config.apiPath + '/product',
      data: { image: $scope.files.image, symbol: $scope.files.symbol, product: $scope.product }
    }).then(function (result) {
      if(result.data.status == "1"){
        $scope.getProductList();
        toastr.success(result.data.message);
        $mdDialog.hide();
      }
      else if(result.data.status == 0){
        $scope.addProductErrors = result.data.message;
      }
    }, function (resp) {
      toastr.error("somthing went wrong try again later");
      // console.log('Error status: ', resp);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.image.name);
    });
  };

  /*=====================
  | Product Section Ends
  =====================*/

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

  $scope.hoardinglist = [
    {
      "id": "AD_001",
      "type": "Billboard",
      "area": "Amreepet",
      "size": "20*30",
      "light": "No",
      "sdate": "28-Feb-2017",
      "edate": "28-April-2017",
      "price": "30,000"
    },
    {
      "id": "AD_002",
      "type": "Unipole",
      "area": "Amreepet",
      "size": "20*30",
      "light": "Yes",
      "sdate": "28-Feb-2017",
      "edate": "28-April-2017",
      "price": "30,000"
    },
    {
      "id": "AD_003",
      "type": "Digital",
      "area": "Amreepet",
      "size": "20*30",
      "light": "Yes",
      "sdate": "28-Feb-2017",
      "edate": "28-April-2017",
      "price": "30,000"
    }
  ]


});