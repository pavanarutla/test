app.controller("ProductCtrl", [
  "$scope",
  "$mdDialog",
  "$http",
  "$rootScope",
  "$stateParams",
  "$window",
  "ProductService",
  "AdminLocationService",
  "OwnerLocationService",
  "CompanyService",
  "MapService",  
  "config",
  "Upload",
  "toastr",
  "$state",
  function(
    $scope,
    $mdDialog,
    $http,
    $rootScope,
    $stateParams,
    $window,
    ProductService,
    AdminLocationService,
    OwnerLocationService,
    CompanyService,
    MapService,
    config,
    Upload,
    toastr,
    $state
  ) {
    var vm = this;
    $scope.msg = {};
    $scope.countryList = [];
    $scope.stateList = [];
    $scope.cityList = [];
    $scope.areaList = [];
    $scope.hoardingCompaniesList = [];

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
    function createPageLinks() {
      var mid = Math.ceil(pageLinks / 2);
      if ($scope.pagination.pageCount < $scope.pagination.pageSize) {
        lowest = 1;
      } else if (
        $scope.pagination.pageNo >= $scope.pagination.pageCount - mid &&
        $scope.pagination.pageNo <= $scope.pagination.pageCount
      ) {
        lowest = $scope.pagination.pageCount - pageLinks;
      } else if (
        $scope.pagination.pageNo > 0 &&
        $scope.pagination.pageNo <= pageLinks / 2
      ) {
        lowest = 1;
      } else {
        lowest = $scope.pagination.pageNo - mid + 1;
      }
      highest =
        $scope.pagination.pageCount < $scope.pagination.pageSize
          ? $scope.pagination.pageCount
          : lowest + (pageLinks - 1);
      $scope.pagination.pageArray = _.range(lowest, highest + 1);
    }

    /*===================
  | Pagination Ends
  ===================*/

    $scope.test = "test";
    /*
  ======== Formats section ========
  */

    // Opens the format form pop up
    $scope.showFormatForm = function(ev) {
      $mdDialog.show({
        templateUrl: "views/admin/add-format-popup.html",
        fullscreen: $scope.customFullscreen,
        clickOutsideToClose: true,
        preserveScope: true,
        scope: $scope
      });
    };

    $scope.generateImageTemplate = function(image) {
      var imagePath = config.serverUrl + image;
      return imagePath;
    };

    // Get Formats list
    function getFormatList() {
      ProductService.getFormatList().then(function(result) {
        $scope.formatList = result;
      });
    }
    getFormatList();

    $scope.format = {};
    $scope.addFormat = function() {
      Upload.upload({
        url: config.apiPath + "/format",
        data: { image: $scope.files.image, format: $scope.format }
      }).then(
        function(result) {
          if (result.data.status == 1) {
            $scope.format = {};
            toastr.success(result.data.message);
            getFormatList();
            $mdDialog.cancel();
          } else if (result.data.status == 0) {
            $scope.addFormatErrors = result.data.message;
          }
        },
        function(resp) {
          toastr.error("somthing went wrong please try again later");
        },
        function(evt) {
          var progressPercentage = parseInt((100.0 * evt.loaded) / evt.total);
        }
      );
    };

    $scope.editFormat = function(format) {
      $scope.format = format;
      $mdDialog.show({
        templateUrl: "views/admin/add-format-popup.html",
        fullscreen: $scope.customFullscreen,
        clickOutsideToClose: true,
        preserveScope: true,
        scope: $scope
      });
    };

    $scope.deleteFormat = function(format) {
      ProductService.deleteFormat(format.id).then(function(result) {
        if (result.status == 1) {
          getFormatList();
          toastr.success(result.message);
        } else {
          toastr.error(result.message);
        }
      });
    };
    /*
  ======== Formats section ends ========
  */
 $scope.searchAreas = function(query) {
    return ProductService.searchAreas(query.toLowerCase()).then(function(res){
      return res;
    });
  }
    $scope.applyFiltersmethod = function(product) {      
      ProductService.getProductList(
        $scope.pagination.pageNo,
        $scope.pagination.pageSize,
        product.type,
        product.budgetprice
      ).then(function(result) {
        $scope.productList = result.products;
        $scope.pagination.pageCount = result.page_count;
        if ($window.innerWidth >= 420) {
          createPageLinks();
        } else {
          $scope.getRange(0, result.page_count);
        }
      });
    };

    AdminLocationService.getCountries().then(function(result) {
      $scope.countryList = result;
    });
    CompanyService.getAllClients().then(function(result) {
      $scope.allClients = result;
    });

    $scope.getStateList = function(product) {
      AdminLocationService.getStates($scope.product.country).then(function(
        result
      ) {
        $scope.stateList = result;
      });
    };
    $scope.getCityList = function() {
      AdminLocationService.getCities($scope.product.state).then(function(
        result
      ) {
        $scope.cityList = result;
      });
    };
    $scope.getAreaList = function() {
      AdminLocationService.getAreas($scope.product.city).then(function(result) {
        $scope.areaList = result;
      });
    };

    /*
  ======== Products section ========
  */
     $scope.getRequestedHoardings = function() {      
      return new Promise((resolve, reject) => {
        ProductService.getRequestedHoardings(
          $scope.pagination.pageNo,
          $scope.pagination.pageSize         
        ).then(
          result => {
            $scope.requestedProductList = result.products;           
            $scope.pagination.pageCount = result.page_count;
            createPageLinks();
            resolve(result);
          },
          result => {
            reject();
          }
        );
      });
    };

    // Opens the product form popup
    $scope.showProductForm = function(ev) {      
      $scope.product = {};
      $mdDialog.show({
        templateUrl: "views/admin/add-product-popup.html",
        fullscreen: $scope.customFullscreen,
        clickOutsideToClose: true,
        preserveScope: true,
        scope: $scope
      });
    };

    // Calenders code

    $scope.rqstHrdngsOpts = {
      multipleDateRanges: true,
      locale: {
          applyClass: 'btn-green',
          applyLabel: "Book Now",
          fromLabel: "From",
          format: "DD-MMM-YY",
          toLabel: "To",
          cancelLabel: 'X',
          customRangeLabel: 'Custom range'
      },
      isInvalidDate: function (dt) {
        for (var i = 0; i < $scope.unavailalbeDateRanges.length; i++) {
            if (moment(dt) >= moment($scope.unavailalbeDateRanges[i].booked_from) && moment(dt) <= moment($scope.unavailalbeDateRanges[i].booked_to)) {
                return true;
            }
        }
        if(moment(dt) < moment()){
            return true;
        }
    },
    isCustomDate: function (dt) {
        for (var i = 0; i < $scope.unavailalbeDateRanges.length; i++) {
            if (moment(dt) >= moment($scope.unavailalbeDateRanges[i].booked_from) && moment(dt) <= moment($scope.unavailalbeDateRanges[i].booked_to)) {
                if (moment(dt).isSame(moment($scope.unavailalbeDateRanges[i].booked_from), 'day')) {
                    return ['red-blocked', 'left-radius'];
                } else if (moment(dt).isSame(moment($scope.unavailalbeDateRanges[i].booked_to), 'day')) {
                    return ['red-blocked', 'right-radius'];
                } else {
                    return 'red-blocked';
                }
            }
        }
        if(moment(dt) < moment()){
            return 'gray-blocked';
        }
    },
    eventHandlers: {
        'apply.daterangepicker': function(ev, picker) { 
            //selectedDateRanges = [];
        }
    }
    };
    $scope.getProductUnavailableDates = function(product, ev){
      // MapService.getProductUnavailableDates(productId).then(function(dateRanges){
      //   $scope.unavailalbeDateRanges = dateRanges;
      //   $(ev.target).parents().eq(3).find('input').trigger('click');
      // });
      if(product.type == "Bulletin"){ 
        MapService.getProductUnavailableDates(product.id).then(function (dateRanges) {
            $scope.unavailalbeDateRanges = dateRanges;
            $(ev.target).parents().eq(3).find('input').trigger('click') ;
        });
    }else if(product.type == "Digital" || product.type == "Transit Digital"){
        MapService.getProductDigitalUnavailableDates(product.id).then(function (blockedDatesAndSlots) {
            $scope.unavailalbeDateRanges = [];
            blockedDatesAndSlots.forEach((item)=>{
                if(item.booked_slots >= product.slots){
                    $scope.unavailalbeDateRanges.push(item);
                }
            })
            $(ev.target).parents().eq(3).find('input').trigger('click') ;
        })
    }else{
      $scope.unavailalbeDateRanges = [];
      $(ev.target).parents().eq(3).find('input').trigger('click') ;
    }
    }
    // $scope.getProductUnavailableDates = function(productId, ev){
    //   ProductService.getProductList(productId).then(function(dateRanges){
    //     $scope.unavailalbeDateRanges = dateRanges;
    //     $(ev.target).parent().parent().find('input').trigger('click');
    //   });
    // }


    // Calenders code ends

    // Get products list

    $scope.getProductList = function() {      
      $scope.searchText = null;     
      ProductService.getProductList(
        $scope.pagination.pageNo,
        $scope.pagination.pageSize
      ).then(function(result) {
        $scope.productList = result.products;
        
        $scope.pagination.pageCount = result.page_count;
        createPageLinks();
      });
    };
    $scope.getProductList();

    $scope.product = {};
  
    $scope.ProductTypes = [
     { name: "Bulletin"},
     { name: "Digital"},
     { name: "Transit Digital"}
   ];
     $scope.bulletinresult = true;
     $scope.trasitResult = false;
     $scope.DigitalResult = false;
     $scope.product.type = $scope.ProductTypes[0];
       $scope.getdetails = function () {
         if ($scope.product.type.name == "Bulletin") {
         $scope.bulletinresult = true;
         $scope.trasitResult = false;
         $scope.DigitalResult = false;
         }
         else if ($scope.product.type.name == "Digital"){
                 $scope.DigitalResult = true;
                 $scope.trasitResult = false;
                 $scope.bulletinresult = false;
         }else if($scope.product.type.name == "Transit Digital"){
                 $scope.trasitResult = true;
                 $scope.bulletinresult = false;
                 $scope.DigitalResult = false;
         }else{
                 $scope.bulletinresult = false;
         }
     }
    $scope.files = {};
    $scope.addProduct = function(adminProductEdit, formdata,Strengths) {
      adminProductEdit.DemographicsAge = formdata;
      adminProductEdit.Strengths=Strengths;
      adminProductEdit.dates.forEach(function(item){
        item.startDate = moment(item.startDate).format('YYYY-MM-DD');
        item.endDate = moment(item.endDate).format('YYYY-MM-DD')
      })
      adminProductEdit.type = adminProductEdit.type.name;
      // adminProductEdit.area = $scope.areaObj.id;
      if(adminProductEdit.type == "Bulletin"){
        var data = {
          image: $scope.files.image,
          symbol: $scope.files.symbol,
          product: JSON.parse(angular.toJson(adminProductEdit))
        }
      }else{
        var data = {
          image: $scope.files.image,
          symbol: $scope.files.symbol,
          product: JSON.parse(angular.toJson(adminProductEdit)),
          booked_slots : 1
        }
      }
      Upload.upload({        
        url: config.apiPath + "/save-product-details",
        data: data
      }).then(function(result) {
          if (result.data.status == "1") {
            $scope.getProductList();
            if ($rootScope.currStateName == "admin.requested-hoardings") {
              $scope.getRequestedHoardings();
            }
            toastr.success(result.data.message);
            $mdDialog.hide();
          } else if (result.data.status == 0) {
            $scope.addProductErrors = result.data.message;
          }
          // addnewProduct();
          // $scope.areaObj ="";
          //  $state.reload();
        },
        function(resp) {
          toastr.error("somthing went wrong try again later");
        },
        function(evt) {
          var progressPercentage = parseInt((100.0 * evt.loaded) / evt.total);
        }
      );
    };
    $scope.searchableAreas = function(query) {
      return OwnerLocationService.searchAreas(query.toLowerCase()).then(function(res){
        return res;
      });
    }
//     function addnewProduct() {
//       document.getElementById("hoardingDrop").classList.toggle("show");
// }
    $scope.editProduct = function(product) {
      // if (product.status != 0) {
      //   product.country = null;
      //   product.state = null;
      //   product.city = null;
      //   product.area = null;
      //   product.company = null;
      // }
      $scope.adminProductEdit = product;
      $scope.location = $scope.adminProductEdit.area_name + ', ' + $scope.adminProductEdit.city_name + ', ' +$scope.adminProductEdit.country_name;
      $mdDialog.show({
        templateUrl: "views/admin/add-product-popup.html",
        fullscreen: $scope.customFullscreen,
        clickOutsideToClose: true,
        preserveScope: true,
        scope: $scope
      });
    };

    $scope.deleteProduct = function(product) {
      ProductService.deleteProduct(product.id).then(function(result) {
        if (result.status == 1) {
          toastr.success(result.message);
          $scope.getProductList();
        } else {
          toastr.error(result.message);
        }
      });
    };

    $scope.viewProductImage = function(image) {
      var imagePath = config.serverUrl + image;
      $mdDialog.show({
        locals: { src: imagePath },
        templateUrl: "views/image-popup-large.html",
        fullscreen: $scope.customFullscreen,
        clickOutsideToClose: true,
        controller: function($scope, src) {
          $scope.img_src = src;
        }
      });
    };

    // $scope.simulateQuery = false;
    $scope.isDisabled = false;
    // $scope.querySearch   = querySearch;
    // $scope.selectedItemChange = selectedItemChange;
    // $scope.searchTextChange   = searchTextChange;

    $scope.productSearch = function(query) {
      return ProductService.searchProducts(query.toLowerCase()).then(function(
        res
      ) {
        $scope.productList = res;
        $scope.pagination.pageCount = 1;
        return res;
      });
    };

    $scope.viewSelectedProduct = function(product) {
      $scope.pagination.pageCount = 1;
      $scope.productList = [product];
    };

    function selectedItemChange(item) {
      //console.log('Item changed to ' + JSON.stringify(item));
    }
/*===================
Form Age  ===================*/

$scope.FromTo = [{id: 'From', name: 'From'}];
   
   $scope.addNewFromTo = function() {
     var newItemNo = $scope.FromTo.length+1;
     $scope.FromTo.push({'id' : 'From' + newItemNo, 'name' : 'From ', 'id' : 'To' + newItemNo, 'name2' : 'To '});
   };   
  //  $scope.removeNewChoice = function() {
  //    var newItemNo = $scope.FromTo.length-1;
  //    if ( newItemNo !== 0 ) {
  //     $scope.FromTo.pop();
  //    }
  //  };   
   $scope.showAddFromTo = function(from) {
     return from.id === $scope.FromTo[$scope.FromTo.length-1].id;
   };

/*===================
Colipos  ===================*/
  $scope.Strengths = [{id: 'Strength 1', name: 'Strength 1'}];
   
   $scope.addNewChoice = function() {
     var newItemNo = $scope.Strengths.length+1;
     $scope.Strengths.push({'id' : 'Strength' + newItemNo, 'name' : 'Strength ' + newItemNo});
   };   
  //  $scope.removeNewChoice = function() {
  //    var newItemNo = $scope.Strengths.length-1;
  //    if ( newItemNo !== 0 ) {
  //     $scope.Strengths.pop();
  //    }
  //  };   
   $scope.showAddChoice = function(strength) {
     return strength.id === $scope.Strengths[$scope.Strengths.length-1].id;
   };

    /*
  ======== Products section ends ========
  */

    $scope.cancel = function() {
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
    if($rootScope.currStateName == 'admin.hoarding-list'){
      $scope.getdetails();
    }
   
    if ($rootScope.currStateName == "admin.requested-hoardings") {
      if ($stateParams.productId) {
        $scope.getRequestedHoardings().then(requestedProducts => {
          var product = _.filter(requestedProducts.products, function(prod) {
            return prod.id == $stateParams.productId;
          });
          typeof product != "undefined" && $scope.editProduct(product[0]);
        });
      } else {
        $scope.getRequestedHoardings();
      }
    }
  }
]);
