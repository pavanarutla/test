app.controller('OwnerProductCtrl', function ($scope, $mdDialog, $mdSidenav, $stateParams, $rootScope, $window, OwnerProductService, ProductService, OwnerLocationService, OwnerCampaignService, Upload, config, toastr) {

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

  $scope.toggleShareProductSidenav = function () {
    $mdSidenav('shareProductSidenav').toggle();
  };

  $scope.toggleShortlistProductsSidenav = function(){
    $mdSidenav('shortlistedProductsSidenav').toggle();
  }

  $scope.toggleShareProductsSidenav = function(){
    $mdSidenav('shareProductsSidenav').toggle();
  }

  $scope.toggleOwnerAddCampaignSidenav = function(){
    $mdSidenav('ownerAddCampaignSidenav').toggle();
  }
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
    $scope.pagination.pageArray = _.range(lowest, highest + 1);
  }
  $scope.getRange = function(b, e){
    $scope.pageRange = [];
    for(i = b+1; i <= e; i++){
      $scope.pageRange.push(i);
    }
    return $scope.pageRange;
  }
  /*===================
  | Pagination Ends
  ===================*/

  /*================================
  | Multi date range picker options
  ================================*/
  $scope.rqstHrdngsOpts = {
    multipleDateRanges: true,
    locale: {
        applyClass: 'btn-green',
        applyLabel: "Apply",
        fromLabel: "From",
        format: "DD-MMM-YY",
        toLabel: "To",
        cancelLabel: 'Cancel',
        customRangeLabel: 'Custom range'
    },
    // isInvalidDate : function(dt){
    //   for(var i=0; i < $scope.unavailalbeDateRanges.length; i++){
    //     if(moment(dt) >= $scope.unavailalbeDateRanges[i].start && moment(dt) <= $scope.unavailalbeDateRanges[i].end){
    //       return true;
    //     }
    //   }
    // },
    // isCustomDate: function(dt){
    //   for(var i = 0; i < $scope.unavailalbeDateRanges.length; i++){
    //     if(moment(dt) >= $scope.unavailalbeDateRanges[i].start && moment(dt) <= $scope.unavailalbeDateRanges[i].end){
    //       if(moment(dt).isSame($scope.unavailalbeDateRanges[i].start, 'day')){
    //         return ['red-blocked', 'left-radius'];
    //       }
    //       else if(moment(dt).isSame($scope.unavailalbeDateRanges[i].end, 'day')){
    //         return ['red-blocked', 'right-radius'];
    //       }
    //       else{
    //         return 'red-blocked';
    //       }
    //     }
    //   }
    // },
  };
  /*====================================
  | Multi date range picker options end
  ====================================*/


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

  $scope.getApprovedProductList = function(){
    OwnerProductService.getApprovedProductList($scope.pagination.pageNo, $scope.pagination.pageSize).then(function(result){
      $scope.productList = result.products;
      $scope.pagination.pageCount = result.page_count;
      if($window.innerWidth >= 420){
        createPageLinks();
      }
      else{
        $scope.getRange(0, result.page_count);
      }
    });
  }

  $scope.filterOwnerProductsWithDates = function(dateFilter){
    OwnerProductService.getApprovedProductListByDates(moment(dateFilter.start_date).toISOString(), moment(dateFilter.end_date).toISOString()).then(function(result){
      $scope.productList = result.products;
      $scope.pagination.pageCount = result.page_count;
      if($window.innerWidth >= 420){
        createPageLinks();
      }
      else{
        $scope.getRange(0, result.page_count);
      }
    });
  }

  var getRequestedProductList = function(){
    OwnerProductService.getRequestedProductList($scope.pagination.pageNo, $scope.pagination.pageSize).then(function(result){
      $scope.requestedProductList = result.products;
      //console.log(result.products);
      $scope.pagination.pageCount = result.page_count;
      if($window.innerWidth >= 420){
        createPageLinks();
      }
      else{
        $scope.getRange(0, result.page_count);
      }
    });
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

  $scope.searchableAreas = function(query) {
    return OwnerLocationService.searchAreas(query.toLowerCase()).then(function(res){
      return res;
    });
  }

  $scope.requestedAddProduct = function(product){
    console.log(product);
  }

  /*=====================
  | Product Section
  =====================*/
  $scope.product = {};
 
  $scope.files = {};
  $scope.requestAddProduct = function (product) {
    product.area = $scope.areaObj.id;
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
        $scope.requestProductErrors = result.data.message;
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

  $scope.viewProductImage = function(image){
    var imagePath = config.serverUrl + image;
    $mdDialog.show({
      locals:{ src: imagePath },
      templateUrl: 'views/image-popup-large.html',
      preserveScope: true,
      scope: $scope,
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
      controller:function($scope, src){
        $scope.img_src = src;
      }
    });
  }
  $scope.closeDialog = function() {
    $mdDialog.hide();
  }

  function getShortlistedProductsByOwner(){
    OwnerProductService.getShortlistedProductsByOwner().then(function(result){
      $scope.shortlistedProducts = result;
    });
  }

  $scope.shortlistProductByOwner = function(productId){
    OwnerProductService.shortListProductByOwner(productId).then(function(result){
      if(result.status == 1){
        getShortlistedProductsByOwner();
        _.map($scope.productList, (p) => {
          if(p.id == productId){
            p.shortlisted = true;
            return p;
          }
        });
        toastr.success(result.message);
      }
      else{
        toastr.error(result.message);
      }
    });
  }

  $scope.deleteShortlistedByOwner = function(productId){
    OwnerProductService.deletedShortListedByOwner(productId).then(function(result){
      if(result.status == 1){
        getShortlistedProductsByOwner();
        _.map($scope.productList, (p) => {
          if(p.id == productId){
            p.shortlisted = false;
            return p;
          }
        });
        toastr.success(result.message);
      }
      else{
        toastr.error(result.message);
      }
    });
  }

  $scope.shareShortlistedProductsByOwner = function(recipientObj){
    OwnerProductService.shareShortlistedProductsByOwner(recipientObj).then(function(result){
      if(result.status == 1){
        toastr.success(result.message);
      }
      else{
        toastr.error(result.message);
      }
    });
  }

  /*=====================
  | Product Section Ends
  =====================*/

   /*=====================
  | Requested hordings
  =====================*/

  $scope.editRequestedhordings = function(product){
    console.log(product);
  };

    /*=====================
  | Requested hordings Ends
  =====================*/
  
  // filter-code
  $scope.viewSelectedProduct = function(product) {
    $scope.pagination.pageCount = 1;
    $scope.productList = [product];
  }
 $scope.productSearch = function(query) {
    return ProductService.searchProducts(query.toLowerCase()).then(function(res){
      $scope.productList = res;
      $scope.pagination.pageCount = 1;
      return res;
    });
  }
  // Filter-code ends


  /*=====================
  | Campaign Section
  =====================*/
  $scope.ownerCampaign = {};
  $scope.ownerCampaign.from_shortlisted = 1;
  $scope.minStartDate = new Date();
  $scope.minEndDate = moment($scope.minStartDate).add(1, 'days').toDate();
  $scope.ownerCampaign.end_date = $scope.minEndDate;
  $scope.defaultStartDate = new Date();

  $scope.updateEndDateValidations = function(){
    $scope.minEndDate = moment($scope.ownerCampaign.start_date).add(1, 'days').toDate();
    if($scope.ownerCampaign.end_date <= $scope.ownerCampaign.start_date){
      $scope.ownerCampaign.end_date = $scope.minEndDate;
    }
  }

  $scope.saveOwnerCampaign = function () {
    OwnerCampaignService.saveOwnerCampaign($scope.ownerCampaign).then(function (result) {
      if (result.status == 1) {
        $scope.ownerCampaign = {};
        $scope.forms.ownerCampaignForm.$setPristine();
        $scope.forms.ownerCampaignForm.$setUntouched();
        toastr.success(result.message);
        setTimeout(function(){
          window.location.reload();
        }, 500);
      }
      else if(result.status == 0){
        if(result.message.constructor == Array){
          $scope.ownerCampaignErrors = result.message;
        }
        else{
          toastr.error(result.message);
        }
      }
      else{
        toastr.error(result.message);
      }
    });
  }

  /*=====================
  | Campaign Section
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

  if($rootScope.currStateName == 'owner.hoarding-list'){
    $scope.getApprovedProductList();
    getShortlistedProductsByOwner();
  }

  if($rootScope.currStateName == 'owner.requested-hoardings'){
    getRequestedProductList();
    $scope.getApprovedProductList()
  }

  /*=============================
  | Page based initial loads end
  =============================*/

});