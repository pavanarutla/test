app.controller('OwnerProductCtrl', function ($scope, $mdDialog, $mdSidenav, $stateParams, $rootScope, $window,MapService , OwnerProductService, ProductService, OwnerLocationService, OwnerCampaignService, Upload, config, toastr,$state) {

  $scope.unavailalbeDateRanges = [];
  // $scope.loadCalendar = false;

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
  $scope.pagination.pageSize = 500;
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


// $scope.getProductByFormat = function(format){
//   $scope.format = format;
//console.log(format);
//  OwnerProductService.getApprovedProductList($scope.pagination.pageNo, $scope.pagination.pageSize,format).then(function(result){
//   $scope.productList = result.products;
//     $scope.pagination.pageCount = result.page_count;
//     if($window.innerWidth >= 420){
//       createPageLinks();
//     }
//     else{
//       $scope.getRange(0, result.page_count);
//     }
//  });
// };
// $scope.getBudget = function(price){
  // $scope.price = price;
  //  OwnerProductService.getApprovedProductList($scope.pagination.pageNo, $scope.pagination.pageSize,format,price).then(function(result){
  //   $scope.productList = result.products;
  //     $scope.pagination.pageCount = result.page_count;
  //     if($window.innerWidth >= 420){
  //       createPageLinks();
  //     }
  //     else{
  //       $scope.getRange(0, result.page_count);
  //     }
  //  });
// };
$scope.applymethod=function(product){
  //console.log(product);
  var data = {};
          var pageNo = $scope.pagination.pageNo;
          var pageSize= $scope.pagination.pageSize;
          var format = product.type;
          var budget = product.budgetprice;
          var start_date = product.start_date;
          var end_date = product.end_date;
				if(!format){
					format = '';
				}
				if(!budget){
					budget = '';
				}
				if(pageNo || pageSize || format || budget || start_date || end_date){
           data.page_no =pageNo;
           data.page_size =pageSize;
           data.format =format;
           data.budget =budget;
           data.start_date =start_date;
           data.end_date =end_date;
				}
     OwnerProductService.getApprovedProductList(data).then(function(result){
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

  /*================================
  | Multi date range picker options
  ================================*/
  $scope.rqstHrdngsOpts = {
    multipleDateRanges: true,
    locale: {
        applyClass: 'btn-green',
        applyLabel: "Book Now",
        fromLabel: "From",
        format: "DD-MMM-YY",
        toLabel: "To",
        cancelLabel: 'Cancel',
        customRangeLabel: 'Custom range'
    },
    isInvalidDate : function(dt){
      for(var i=0; i < $scope.unavailalbeDateRanges.length; i++){
        if(moment(dt) >= $scope.unavailalbeDateRanges[i].start && moment(dt) <= $scope.unavailalbeDateRanges[i].end){
          return true;
        }
      }
    },
    isCustomDate: function(dt){
      for(var i = 0; i < $scope.unavailalbeDateRanges.length; i++){
        if(moment(dt) >= $scope.unavailalbeDateRanges[i].start && moment(dt) <= $scope.unavailalbeDateRanges[i].end){
          if(moment(dt).isSame($scope.unavailalbeDateRanges[i].start, 'day')){
            return ['red-blocked', 'left-radius'];
          }
          else if(moment(dt).isSame($scope.unavailalbeDateRanges[i].end, 'day')){
            return ['red-blocked', 'right-radius'];
          }
          else{
            return 'red-blocked';
          }
        }
      }
    },
  };
  $scope.inventoryListOpts = {
    multipleDateRanges: true,
    opens: 'center',
    locale: {
        applyClass: 'btn-green',
        applyLabel: "Book Now",
        fromLabel: "From",
        format: "DD-MMM-YY",
        toLabel: "To",
        cancelLabel: 'Cancel',
        customRangeLabel: 'Custom range'
    },
    isInvalidDate : function(dt){
      for(var i=0; i < $scope.unavailalbeDateRanges.length; i++){
        if(moment(dt) >= moment($scope.unavailalbeDateRanges[i].booked_from) && moment(dt) <= moment($scope.unavailalbeDateRanges[i].booked_to)){
          return true;
        }
      }
    },
    isCustomDate: function(dt){
      for(var i = 0; i < $scope.unavailalbeDateRanges.length; i++){
        if(moment(dt) >= moment($scope.unavailalbeDateRanges[i].booked_from) && moment(dt) <= moment($scope.unavailalbeDateRanges[i].booked_to)){
          if(moment(dt).isSame(moment($scope.unavailalbeDateRanges[i].booked_from), 'day')){
            return ['red-blocked', 'left-radius'];
          }
          else if(moment(dt).isSame(moment($scope.unavailalbeDateRanges[i].booked_to), 'day')){
            return ['red-blocked', 'right-radius'];
          }
          else{
            return 'red-blocked';
          }
        }
      }
    },
  };
  /*====================================
  | Multi date range picker options end
  ====================================*/
  // SHORT-LIST
  $scope.shortlistSelected = function (productId, selectedDateRanges, ev) {
    var sendObj = {
      product_id: productId,
      dates: selectedDateRanges
    }
    MapService.shortListProduct(sendObj).then(function (response) {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('body')))
          .clickOutsideToClose(true)
          .title('Shortlist Product')
          .textContent(response.message)
          .ariaLabel('shortlist-success')
          .ok('Got it!')
          .targetEvent(ev),
        $mdSidenav('productDetails').close()
      );
      getShortListedProducts();
      $mdSidenav('productDetails').close();
    });
  }
  function getShortListedProducts() {
    MapService.getshortListProduct(JSON.parse(localStorage.loggedInUser).id).then(function (response) {
       shortListedProductsLength = response.length;
      $scope.shortListedProducts = response;
      $rootScope.$emit("shortListedProducts",shortListedProductsLength)
    });
  }
  getShortListedProducts();
  $scope.getProductUnavailableDates = function(productId, ev){
    MapService.getProductUnavailableDates(productId).then(function(dateRanges){
      $scope.unavailalbeDateRanges = dateRanges;
      $(ev.target).parents().eq(3).find('input').trigger('click');
    });
  }
  // SHORT-LIST ENDs
  // Save-camp
  $scope.toggleExistingCampaignSidenav = function () {
    $scope.showSaveCampaignPopup = !$scope.showSaveCampaignPopup;
  }
  // Save-camp-end


  var getFormatList = function(){
    OwnerProductService.getFormatList().then(function(result){
      $scope.formatList = result;
    });
  }
  getFormatList();

  var getCountryList = function(){
    OwnerLocationService.getCountries().then(function(result){
      //console.log(result);
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
      // console.log(result.products);
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
    //console.log(product);
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
  $scope.productdetails = [{
    id: 1,
    price: '60000'
  }]

  $scope.requestedAddProduct = function(product){
    //console.log(product);
  }

  $scope.editUtterance = function(data) {
    data.edit = true;
    //console.log(data.edit);
  }
  $scope.save = function(data) {
    data.edit = false;
  }




  /*=====================
  | Product Section
  =====================*/  
  $scope.product = {};
 
  $scope.files = {};
  $scope.requestAddProduct = function (product) {
    console.log(product);
    product.area = $scope.areaObj.id;
    Upload.upload({
      url: config.apiPath + '/request-owner-product-addition',
      data: { image: $scope.files.image, product: $scope.product }
    }).then(function (result) {
      if(result.data.status == "1"){
        getRequestedProductList();
        toastr.success(result.data.message);              
      }
      else if(result.data.status == 0){
        $scope.requestProductErrors = result.data.message;
        toastr.success(result.data.message);
      }      
      document.getElementById("myDropdown").classList.toggle("show");
      $state.reload;
      $scope.product = [];
      product.dates="";
      $scope.hordinglistform.$setPristine();
      $scope.hordinglistform.$setUntouched();
      $scope.areaObj ="";
      $state.reload();
    }, function (resp) {
      //console.log('Error status: ', resp);
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

  $scope.getProductUnavailableDatesEdit = function(ev){
    var productId = $stateParams.id;
    OwnerProductService.getProductUnavailableDates(productId).then(function(dateRanges){
      $scope.unavailalbeDateRanges = dateRanges;
      $(ev.target).parent().parent().find('input').trigger('click');
    });
  }

  $scope.getProductUnavailableDates = function(productId, ev){
    OwnerProductService.getProductUnavailableDates(productId).then(function(dateRanges){
      $scope.unavailalbeDateRanges = dateRanges;
      $(ev.target).parent().parent().find('input').trigger('click');
    });
  }
  /*=====================
  | Product Section Ends
  =====================*/

  //updated edited product details

  $scope.updateeditProductdetails = function(editRequestedhordings){    
    editRequestedhordings.area = $scope.areaObj.id;
    editRequestedhordings.id = $stateParams.id;
    Upload.upload({
      url: config.apiPath + '/request-owner-product-addition',
      data: { image: $scope.files.image, editRequestedhordings: $scope.editRequestedhordings }
    }).then(function (result) {
      if(result.data.status == "1"){
        getRequestedProductList();
        toastr.success(result.data.message);        
      }
      else if(result.data.status == 0){
        $scope.requestProductErrors = result.data.message;
        toastr.error(result.data.message);
      }
      // document.getElementById("myDropdown").classList.toggle("show");
    }, function (resp) {
      //console.log('Error status: ', resp);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.image.name);
    });
    }
    
   /*=====================
  | Requested hordings
  =====================*/

  $scope.editRequestedhordings = function(id){
     OwnerProductService.getProductDetails(id).then(function(res){       
      $scope.editRequestedhordings = res.product_details
      return res.product_details;
    })
  };

    /*=====================
  | Requested hordings Ends
  =====================*/
  
  // filter-code
  $scope.viewSelectedProduct = function(product) {
    $scope.pagination.pageCount = 1;
    $scope.productList = [product];
  }
  $scope.viewSearchText = function(text) {
    
    if(text==''){
      //console.log("text");
      $scope.getApprovedProductList();
    }
  }
 $scope.productSearch = function(query) {
    return OwnerProductService.searchOwnerProducts(query.toLowerCase()).then(function(res){
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
    // $scope.getApprovedProductList()
  }
  
  if($rootScope.currStateName == 'owner.editproduct-details'){
    $scope.editRequestedhordings($stateParams.id)    
    }
  
  $scope.changeProductPrice = function(data){
    product = {};
    product.id = data.id;
    product.default_price = data.default_price;
    OwnerProductService.changeProductPrice(product).then(function (result) {
      if(result.status == 1){
        toastr.success(result.message);        
      }
      else{
        toastr.error(result.data.message);
      }
    });

  }

  $scope.product_visibility = function(product_visibility,product_id){
    visibility = {};
    visibility.product_visibility =product_visibility ;
    OwnerProductService.changeProductVisibility(product_id,visibility).then(function (result) {
      if(result.status == 1){
        toastr.success(result.message);        
      }
      else{
        toastr.error(result.data.message);
      }
    });

  }
  

  /*=============================
  | Page based initial loads end
  =============================*/

});