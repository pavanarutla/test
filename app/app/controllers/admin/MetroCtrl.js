app.controller('AdminMetroCtrl', function($scope, $mdDialog, $rootScope, ProductService, Upload, toastr){

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
  /*================================
  | Popup and Sidenav controls end
  ================================*/

  /*===============================
  | Formats section
  ===============================*/
  var getFormatList = function(obj){
    ProductService.getFormatList(obj).then(function(result){
      $scope.formatList = result;
      console.log(result);
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


  /*================================
  | Page based initial loads
  ================================*/
  if($rootScope.currStateName == 'admin.metro-formats'){
    getFormatList({type: "metro"});
  }
  if($rootScope.currStateName == 'admin.metro-packages'){
    getFormatList({type: "metro"});
    // getMetroPackages();
  }
  /*================================
  | Page based initial loads end
  ================================*/
  
});