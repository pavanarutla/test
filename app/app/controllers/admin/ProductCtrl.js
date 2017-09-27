app.controller('ProductCtrl', function ($scope, $mdDialog, $http, ProductService, AdminLocationService, CompanyService, config, Upload, toastr) {

  var vm = this;
  $scope.msg = {};
  $scope.countryList = [];
  $scope.stateList = [];
  $scope.cityList = [];
  $scope.areaList = [];
  $scope.hoardingCompaniesList = [];

  $scope.test = "test";
  /*
  ======== Formats section ========
  */

  // Opens the format form pop up
  $scope.showFormatForm = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/admin/add-format-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };
  
  // UI-Grid for formats
  $scope.gridFormats = {
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

  $scope.generateImageTemplate = function(image){
    var imagePath = config.serverUrl + image;
    return imagePath;
  }

  $scope.gridFormats.columnDefs = [
    { name: 'image', displayName: 'Icon', width: '40%', enableCellEdit: false },
    { name: 'name', displayName: 'Format Type', enableCellEdit: false, width: '30%' },
    {
      name: 'Action', field: 'Action', width: '30%',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a href="" ng-click="grid.appScope.editFormat(row.entity)"><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a ng-href="#" ng-click="grid.appScope.deleteFormat(row.entity.id)"><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
      enableFiltering: false
    }
  ];

  $scope.gridFormats.onRegisterApi = function (gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };
  // UI-Grid for formats ends

  // Get Formats list
  ProductService.getFormatList().then(function(result){
    $scope.gridFormats.data = result;
    $scope.formatList = result;
  });

  // Adding new format
  // $http.get('fakedb/companyagency.json').success(function (data) {
  //   for (i = 0; i < data.length; i++) {
  //     data[i].registered = new Date(data[i].registered);
  //   }
  //   $scope.gridFormats.data = data;
  // });

  $scope.format = {};
  $scope.addFormat = function () {
    Upload.upload({
      url: config.apiPath + '/format',
      data: {image: $scope.files.image, format: $scope.format}
    }).then(function (result) {
      if(result.data.status == 1){
        ProductService.getFormatList().then(function(result){
          $scope.gridFormats.data = result;
        });
        toastr.success(result.data.message);
      }
      else{
        toastr.error(result.data.message);
      }
    }, function (resp) {
      console.log('Error status: ', resp);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log('progress: ' + progressPercentage + '% ' + evt.config.data.image.name);
    });
  };

  $scope.editFormat = function(format){
    console.log(format);
    $scope.format = format;
    $mdDialog.show({
      templateUrl: 'views/admin/add-format-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      preserveScope: true,
      scope: $scope
    });
  }

  $scope.deleteFormat = function(formatId){
    ProductService.deleteFormat(formatId).then(function(result){
      if(result.status == 1){
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
    AdminLocationService.getStates($scope.product.country).then(function(result){
      $scope.stateList = result;
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
    $mdDialog.show({
      templateUrl: 'views/admin/add-product-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      preserveScope: true,
      scope: $scope
    })
  };
  
  // UI-Grid for products
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
  
  $scope.gridProducts.columnDefs = [
    { name: 'siteNo', displayName: 'Site No', enableCellEdit: false, width: '15%' },
    { name: 'format_name', displayName: 'Site type', enableCellEdit: false, width: '10%' },
    { name: 'address', displayName: 'Address', width: '15%', enableCellEdit: false },
    { name: 'impressions', displayName: 'Impression', width: '10%', enableCellEdit: false },
    { name: 'area_name', displayName: 'Area', width: '20%' },
    { name: 'panelSize', displayName: 'Panel Size', type: 'number', width: '20%' },
    { name: 'lighting', displayName: 'lighting', width: '10%' },
    { name: 'direction', displayName: 'Direction', width: '10%', enableCellEdit: false, },
    { name: 'image', displayName: 'Image', width: '10%', enableCellEdit: false, },
    { name: 'symbol', displayName: 'Symbol', width: '10%', enableCellEdit: false, },
    {
      name: 'Action', field: 'Action', width: '10%',
      cellTemplate: '<div class="ui-grid-cell-contents"><span><a href="" ng-click="grid.appScope.editProduct(row.entity)"><md-icon><i class="material-icons">mode_edit</i></md-icon></a></span><span><a ng-href="#" ng-click=""><md-icon><i class="material-icons">done</i></md-icon></a></span><span><a href="" ng-click="grid.appScope.deleteProduct(row.entity.id)"><md-icon><i class="material-icons">delete</i></md-icon></a></span></div>',
      enableFiltering: false,
    }
  ];
  
  $scope.gridProducts.onRegisterApi = function (gridApi) {
    $scope.gridApi = gridApi;
    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
      $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
      $scope.$apply();
    });
  };
  // UI-Grid for products ends

  // Get products list
  ProductService.getProductList().then(function(result){
    $scope.gridProducts.data = result;
    console.log(result);
  });

  // Adding Products
  // $http.get('fakedb/companyagency.json')
  // .success(function (data) {
  //   for (i = 0; i < data.length; i++) {
  //     data[i].registered = new Date(data[i].registered);
  //   }
  //   $scope.gridHoarding.data = data;
  // });

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
      console.log('Error status: ', resp);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.image.name);
    });
  };

  $scope.editProduct = function(product){
    // console.log(product);
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

  $scope.deleteProduct = function(productId){
    ProductService.deleteProduct(productId).then(function(result){
      if(result.status == 1){
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

});