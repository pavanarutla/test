app.controller('ProductCtrl', ['$scope', '$mdDialog', '$http', '$rootScope', '$stateParams', 'ProductService', 'AdminLocationService', 'CompanyService', 'config', 'Upload', 'toastr',function ($scope, $mdDialog, $http, $rootScope, $stateParams, ProductService, AdminLocationService, CompanyService, config, Upload, toastr) {

  var vm = this;
  $scope.msg = {};
  $scope.countryList = [];
  $scope.stateList = [];
  $scope.cityList = [];
  $scope.areaList = [];
  $scope.hoardingCompaniesList = [];
  $scope.EditState = 0;
  $scope.EditCity = 0;

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
    $scope.pagination.pageArray = _.range(lowest, highest + 1);
  }
   
  $scope.closeDialog = function() {
    $mdDialog.hide();
  }
  /*===================
  | Pagination Ends
  ===================*/

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

  $scope.generateImageTemplate = function(image){
    var imagePath = config.serverUrl + image;
    return imagePath;
  }

  // Get Formats list
  function getFormatList(){
    ProductService.getFormatList().then(function(result){
      $scope.formatList = result;
    });
  }
  getFormatList();

  $scope.format = {};
  $scope.addFormat = function () {
    Upload.upload({
      url: config.apiPath + '/format',
      data: {image: $scope.files.image, format: $scope.format}
    }).then(function (result) {
      if(result.data.status == 1){
        $scope.format = {};
        toastr.success(result.data.message);
        getFormatList();
        $mdDialog.cancel();
      }
      else if(result.data.status == 0){
        $scope.addFormatErrors = result.data.message;
      }
    }, function (resp) {
      toastr.error("somthing went wrong please try again later");
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.image.name);
    });
  };

  $scope.editFormat = function(format){
    $scope.format = format;
    $mdDialog.show({
      templateUrl: 'views/admin/add-format-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      preserveScope: true,
      scope: $scope
    });
  }

  $scope.deleteFormat = function(format){
    ProductService.deleteFormat(format.id).then(function(result){
      if(result.status == 1){
        getFormatList();
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
  CompanyService.getAllClients().then(function(result){
    $scope.allClients = result;
  });

  $scope.getStateList = function(product){
    AdminLocationService.getStates($scope.product.country).then(function(result){
      $scope.stateList = result;
    });
  }
  $scope.getCityList = function(status){
    AdminLocationService.getCities($scope.product.state).then(function(result){
      $scope.cityList = result;
    });
    if(status!='edit') $scope.EditState = 0;
    else  $scope.EditState = 1;
    
  }
  $scope.getAreaList = function(state){
    AdminLocationService.getAreas($scope.product.city).then(function(result){
      $scope.areaList = result;
    });
    if(status!='edit') $scope.EditCity = 0;
    else  $scope.EditCity = 1;
  }
  
  /*
  ======== Products section ========
  */

  var getRequestedHoardings = function(){
    return new Promise((resolve, reject) => {
      ProductService.getRequestedHoardings($scope.pagination.pageNo, $scope.pagination.pageSize).then((result) => {
        $scope.requestedProductList = result.products;
        $scope.pagination.pageCount = result.page_count;
        createPageLinks();
        resolve(result);
      },
      (result) => {
        reject();
      });
    });
  }

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

  // Get products list

  $scope.getProductList = function(){
    $scope.searchText = null;
    ProductService.getProductList($scope.pagination.pageNo, $scope.pagination.pageSize).then(function(result){
      $scope.productList = result.products;
      $scope.pagination.pageCount = result.page_count;
      createPageLinks();
    });
  }
  $scope.getProductList();

  $scope.product = {};
 
  $scope.files = {};
  $scope.addProduct = function () {
    Upload.upload({
      url: config.apiPath + '/product',
      data: { image: $scope.files.image, symbol: $scope.files.symbol, product: $scope.product }
    }).then(function (result) {
      if(result.data.status == "1"){
        $scope.getProductList();
        if($rootScope.currStateName == 'admin.requested-hoardings'){
          getRequestedHoardings();
        }
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

  $scope.editProduct = function(product){
    if(product.status != 0){
      console.log(product);
      product.client = product.client_mongo_id;
      $scope.product.country = product.country;
      $scope.product.state = product.state;
      $scope.product.city = product.city;
      $scope.EditState = 1;
      $scope.EditCity = 1;
      $scope.getStateList('edit');
      $scope.getCityList('edit');
      $scope.getAreaList();
      // product.company = null;
    }
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
        toastr.success(result.message);
        $scope.getProductList();
      }
      else{
        toastr.error(result.message);
      }
    });
  }

  $scope.viewProductImage = function(image){
    var imagePath = config.serverUrl + image;
    $mdDialog.show({
      locals:{ src: imagePath },
      templateUrl: 'views/image-popup-large.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
      controller:function($scope, src){
        $scope.img_src = src;
        $scope.closeDialog = function() {
          $mdDialog.hide();
        }
      }
    });
  }

  // $scope.simulateQuery = false;
  $scope.isDisabled    = false;
  // $scope.querySearch   = querySearch;
  // $scope.selectedItemChange = selectedItemChange;
  // $scope.searchTextChange   = searchTextChange;


  $scope.productSearch = function(query) {
    return ProductService.searchProducts(query.toLowerCase()).then(function(res){
      $scope.productList = res;
      $scope.pagination.pageCount = 1;
      return res;
    });
  }

  $scope.viewSelectedProduct = function(product) {
    $scope.pagination.pageCount = 1;
    $scope.productList = [product];
  }

  function selectedItemChange(item) {
    //console.log('Item changed to ' + JSON.stringify(item));
  }

  /*
  ======== Products section ends ========
  */

  $scope.cancel = function () {
    $mdDialog.cancel();
  };

    // tables code start
    // var vm = $scope;
    // vm.limit = 5;
    // $scope.loadMore = function() {
    //   var increamented = vm.limit + 5;
    //   vm.limit = increamented > $scope.hoardinglistdata.length ? $scope.hoardinglistdata.length : increamented;
    // };
  // tables code end

  // var callAndWait = function(fn){
  //   return new Promise((resolve, reject) => {
  //     setTimeout(function(){
  //       fn();
  //       resolve();
  //     });
  //   });    
  // }

  if($rootScope.currStateName == 'admin.requested-hoardings'){
    if($stateParams.productId){
      getRequestedHoardings().then((requestedProducts) => {
        var product = _.filter(requestedProducts.products, function(prod){          
          return prod.id == $stateParams.productId;
        });
        (typeof product != 'undefined') && $scope.editProduct(product[0]);
      });
    }
    else{
      getRequestedHoardings();
    }
  }

}]);