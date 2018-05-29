app.controller('requestHoarding', function ($scope,$mdDialog,$mdSidenav,$window,ProductService,Upload,config,toastr) {
    
    $scope.openScreen = function(ev) {
        $mdDialog.show({
          templateUrl:'views/owner/requesthoardingadd.html',
          clickOutsideToClose:true,
   
        });
    };

    $scope.viewImage = function (image) { 
        $mdDialog.show({
        templateUrl: 'views/owner/viewimage.html',
        fullscreen: $scope.customFullscreen,
        clickOutsideToClose: true,
        locals:{dataToPass: image},                
        controller: function ($scope, dataToPass,config) { 
                        $scope.image = dataToPass;
                        $scope.serverUrl = config.serverUrl;
                    },
        })
    };
    // sidenav 
     $scope.addRequestHoarding = function () {
    $mdSidenav('ownerAddHoarding').toggle();
    };

    $scope.hoardinglist =[
      {
        "id":"AD_001",
        "type":"Billboard",
        "area":"Amreepet",
        "size":"20*30",
        "light":"No",
        "sdate":"28-Feb-2017",
        "edate":"28-April-2017",
        "price":"30,000"
      },
      {
        "id":"AD_002",
        "type":"Unipole",
        "area":"Amreepet",
        "size":"20*30",
        "light":"Yes",
        "sdate":"28-Feb-2017",
        "edate":"28-April-2017",
        "price":"30,000"
      },
      {
        "id":"AD_003",
        "type":"Digital",
        "area":"Amreepet",
        "size":"20*30",
        "light":"Yes",
        "sdate":"28-Feb-2017",
        "edate":"28-April-2017",
        "price":"30,000"
      }
    ]
   // alert("hiiii");
   
  $scope.submittedtrue = false;
  $scope.product = {};
  $scope.files = {};
  $scope.addProduct = function () {
   // alert("hiiii");
    $scope.submittedtrue = true;
    if($scope.addProductForm.$valid){
        Upload.upload({
          url: config.apiPath + '/save-owner-product',
          data: { image: $scope.files.image, product: $scope.product }
        }).then(function (result) {
          if(result.data.status == "1"){
            ProductService.getProductList().then(function(result){
              $scope.pendingproducts = result;
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
    }
  };

  ProductService.getFormatList().then(function(result){
    $scope.formatList = result;
  }); 

  ProductService.productsByStatus('pending').then(function(result){
    $scope.pendingproducts = result;
  });



});