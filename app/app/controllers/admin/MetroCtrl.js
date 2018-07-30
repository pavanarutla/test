app.controller('AdminMetroCtrl', function($scope, $mdDialog, $rootScope, ProductService, AdminLocationService, AdminMetroService, Upload, toastr){

  /*=============================
  | Global variables
  =============================*/
  $scope.forms = [];
  $scope.files = [];
  /*=============================
  | Global variables end
  =============================*/

  /*==============================
  | Popup and Sidenav controls
  ==============================*/  
  $scope.showFormatForm = function (ev) {
    $scope.formatPopupType = "metro";
    $mdDialog.show({
      templateUrl: 'views/admin/add-format-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      preserveScope: true,
      scope: $scope
    })
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

  $scope.selectPackage = function (ev) {
    $mdDialog.show({
      templateUrl: 'views/selectpack.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };
  /*================================
  | Popup and Sidenav controls end
  ================================*/

  /*===============================
  | Formats section
  ===============================*/
  var getFormatList = function(obj){
    ProductService.getFormatList(obj).then(function(result){
      $scope.formatList = result;
    });
  }

  $scope.addFormat = function(format){
    Upload.upload({
      url: config.apiPath + '/format',
      data: {image: $scope.files.image, format: format}
    }).then(function (result) {
      if(result.data.status == 1){
        $scope.format = {};
        toastr.success(result.data.message);
        getFormatList({type: "metro"});
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
  } 
  /*===============================
  | Formats section ends
  ===============================*/

  /*==============================
  | Corridors
  ==============================*/
  // $scope.selectedCorridorCity = {};
  $scope.citySearch = function(query){
    return AdminLocationService.searchCities(query.toLowerCase()).then(function(res){
      return res;
    });
  }

  function getMetroCorridors(){
    AdminMetroService.getMetroCorridors().then(function(result){
      $scope.metroCorridorList = result;
    });
  }

  $scope.saveCorridor = function(corridor){
    corridor.city_id = $scope.selectedCorridorCity.id;
    AdminMetroService.saveCorridor(corridor).then(function(result){
      if(result.status == 1){
        getMetroCorridors();
        toastr.success(result.message);
      }
      else{
        if(result.message.constructor === Array){
          $scope.addCorridorErrors = result.message;
        }
        else{
          toastr.error(result.message);
        }
      }
    });
  }
  /*==============================
  | Corridors end
  ==============================*/

  /*==============================
  | Packages
  ==============================*/
  function getMetroPackages(){
    AdminMetroService.getMetroPackages().then(function(result){
      $scope.metroPackageList = result;
    });
  }
  $scope.savePackage = function(package){
    AdminMetroService.savePackage(package).then(function(result){
      if(result.status == 1){
        getMetroPackages();
        toastr.success(result.message);
      }
      else{
        if(result.message.constructor === Array){
          $scope.addPackageErrors = result.message;
        }
        else{
          toastr.error(result.message);
        }
      }
    });
  }
  $scope.editPackage = function (package) {
    $scope.package = {};
    $scope.package.id = package.id;
    $scope.package.name = package.name;
    $scope.package.format_id = null;
    $scope.package.corridor_id = null;
    $scope.package.months = package.months;
    $scope.package.days = package.days;
    $scope.package.price = package.price;
    $scope.package.max_trains = package.max_trains;
  }
  /*==============================
  | Packages end
  ==============================*/

  /*================================
  | Page based initial loads
  ================================*/
  if($rootScope.currStateName == 'admin.metro-formats'){
    getFormatList({type: "metro"});
  }
  if($rootScope.currStateName == 'admin.metro-packages'){
    getFormatList({type: "metro"});
    getMetroCorridors();
    getMetroPackages();
  }
  /*================================
  | Page based initial loads end
  ================================*/
  
});