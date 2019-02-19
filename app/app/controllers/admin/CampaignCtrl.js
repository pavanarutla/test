app.controller('AdminCampaignCtrl', function ($scope, $mdDialog, $mdSidenav, $stateParams, $location,Upload,config  , $rootScope, CampaignService, AdminCampaignService,AdminContactService, AdminMetroService, ProductService,ContactService, toastr, FileSaver, Blob, MetroService, $window) {
  $scope.newDate = new Date();
  $scope.CAMPAIGN_STATUS = [
    'campaign-preparing',    //    100
    'campaign-created',      //    200
    'quote-requested',       //    300
    'quote-given',           //    400
    'change-requested',      //    500
    'booking-requested',     //    600 
    'booked',                //    700
    'suspended',             //    800
    'stopped'                //    900
  ];

  /*===================================
  | Popups and Sidenavs
  ===================================*/
  $scope.AddMetroCampaign = function () {
    $mdSidenav('metroAddCmapginSidenav').toggle();
  };
  $scope.toggleAddMetroProductSidenav = function () {
    $mdSidenav('add-metro-product-sidenav').toggle();
  };

  /*===================================
  | Popups and Sidenavs end
  ===================================*/

  var getAllCampaigns = function () {
    AdminCampaignService.getAllCampaigns().then(function (result) {
      $scope.plannedCampaigns = _.filter(result.user_campaigns, function (c) {
        //return c.status < 800 && typeof c.name !== "undefined";
           return c.status == 300 || c.status == 400 || c.status == 500 || c.status == 600; 
      });
      $scope.scheduledCampaigns = _.filter(result.user_campaigns, function (c) {
       // return c.status == 800 && typeof c.name !== "undefined";
          return c.status == 700;
      });
      $scope.runningCampaigns = _.filter(result.user_campaigns, function (c) {
    //    return c.status == 1141 && typeof c.name !== "undefined";
      return c.status == 800;
      });
      $scope.closedCampaigns = _.filter(result.user_campaigns, function (c) {
                  //  return c.status == 1151 && typeof c.name !== "undefined";
                  return c.status == 1000 || c.status == 900;
      });
      // $scope.runningCampaigns = _.where(result.user_campaigns, { status: _.indexOf($scope.CAMPAIGN_STATUS, 'booked') });
      // $scope.closedCampaigns = _.where(result.user_campaigns, { status: _.indexOf($scope.CAMPAIGN_STATUS, 'stopped') });
      $scope.adminCampaigns = result.admin_campaigns;
    });
  }
  getAllCampaigns();

  /*=====================
  | Filtering Campaigns
  =====================*/
  // $scope.simulateQuery = false;
  $scope.isDisabled = false;
  // $scope.querySearch   = querySearch;
  // $scope.selectedItemChange = selectedItemChange;
  // $scope.searchTextChange   = searchTextChange;


  $scope.campaignSearch = function (query) {
    return AdminCampaignService.searchCampaigns(query.toLowerCase()).then(function (res) {
      return res;
    });
  }

  $scope.viewSelectedCampaign = function (campaign) {
    $location.path('/admin/campaign-proposal-summary/' + campaign.id);
  }

  function selectedItemChange(item) {    
  }

  /*=========================
  | Filtering Campaigns Ends
  =========================*/

  // $scope.showAddCampaignPopup = function () {
  //   $mdDialog.show({
  //     templateUrl: 'views/admin/add-full-campaign.html',
  //     clickOutsideToClose: true,
  //     fullscreen: $scope.customFullscreen,
  //     controller: function ($scope, $mdDialog, AdminCampaignService, toastr) {
  //       $scope.campaign = {};
  //       var startDate = new Date();
  //       var productFromDate = new Date($scope.campaign.start_date);
  //       var productToDate = new Date($scope.campaign.end_date);
  //       $scope.fromMinDate = new Date(
  //         startDate.getFullYear(),
  //         startDate.getMonth(),
  //         startDate.getDate() + 5
  //       );
  //       $scope.toMinDate = new Date(
  //         startDate.getFullYear(),
  //         startDate.getMonth(),
  //         productFromDate.getDate() + 1
  //       );
  //       $scope.toMaxDate = new Date(
  //         startDate.getFullYear(),
  //         startDate.getMonth(),
  //         productToDate.getDate()
  //       );
  //       $scope.saveCampaignByAdmin = function () {
  //         AdminCampaignService.saveCampaignByAdmin($scope.campaign).then(function (result) {
  //           if (result.status == 1) {
  //             getAllCampaigns();
  //             toastr.success(result.message);
  //             $mdDialog.hide();
  //           }
  //           else if (result.status == 0) {
  //             $scope.campaignDetailsErrorEessages = result.message;
  //           }
  //         }, function (result) {
  //           $scope.campaignDetailsErrorEessages = "somthing went wrong please try again after some time!"
  //         });
  //       }
  //       $scope.close = function () {
  //         $mdDialog.hide();
  //       }
  //     }
  //   });
  // };
  $scope.getProductList = function(){
    ProductService.getProductList().then(function(result){
      $scope.AdminProduct = result.products;
      CampaignService.getCampaignWithProducts($stateParams.campaignId).then(function(results){
        _.map($scope.AdminProduct, function (product) {
              /*if (product.id == (result.products)) {
                  product.alreadyAdded = true;
              }*/
              //alert("FD1");
              if (Object.values(results.products).indexOf(product.id) > -1) {
                //alert("FDg");
                  product.alreadyAdded = true;
             }
              return product;
          });
      });
      
    });
  }
  $scope.saveCampaignByAdmin = function (AdminownerCampaign) {
    AdminCampaignService.saveCampaignByAdmin(AdminownerCampaign).then(function (result) {      
      if (result.status == 1) {
        getAllCampaigns();
        toastr.success(result.message);
        $mdDialog.hide();
      }
      else if (result.status == 0) {
        $scope.campaignDetailsErrorEessages = result.message;
      }
      $scope.AdminownerCampaign={};
      myFunction();
    }, function (result) {
      $scope.campaignDetailsErrorEessages = "somthing went wrong please try again after some time!"
    });
  }
  function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  $scope.deleteUserCampaign = function (campaignId) {
    AdminCampaignService.deleteUserCampaign(campaignId).then(function (result) {
      if (result.status == 1) {
        getAllCampaigns();
        toastr.success(result.message);
        $mdDialog.hide();
      }
      else if (result.status == 0) {
        toastr.error(result.message);
      }
    }, function (result) {
      toastr.error("somthing went wrong please try again after some time!");
    });
  }

  $scope.deleteNonUserCampaign = function (campaignId) {
    AdminCampaignService.deleteNonUserCampaign(campaignId).then(function (result) {
      if (result.status == 1) {
        getAllCampaigns();
        toastr.success(result.message);
        $mdDialog.hide();
      }
      else if (result.status == 0) {
        toastr.error(result.message);
      }
    }, function (result) {
      toastr.error("somthing went wrong please try again after some time!");
    });
  }
  /*
  *========= campaign proposal(planned) grid =========
  */
 // filter-code
 $scope.viewSelectedProduct = function (product) {
  $scope.pagination.pageCount = 1;
  $scope.productList = [product];
}
$scope.productSearch = function (query) {
  return ProductService.searchProducts(query.toLowerCase()).then(function (res) {
      $scope.productList = res;
      $scope.pagination.pageCount = 1;
      return res;
  });
}

$scope.applymethod = function (product) {
  var data = {};
  var pageNo = $scope.pagination.pageNo;
  var pageSize = $scope.pagination.pageSize;
  var format = product.type;
  var budget = product.budgetprice;
  var start_date = product.start_date;
  var end_date = product.end_date;
  if (!format) {
      format = '';
  }
  if (!budget) {
      budget = '';
  }
  if (pageNo || pageSize || format || budget || start_date || end_date) {
      data.page_no = pageNo;
      data.page_size = pageSize;
      data.format = format;
      data.budget = budget;
      data.start_date = start_date;
      data.end_date = end_date;
  }
  AdminCampaignService.getApprovedProductList(data).then(function (result) {
      $scope.productList = result.products;
      $scope.pagination.pageCount = result.page_count;
      if ($window.innerWidth >= 420) {
          createPageLinks();
      } else {
          $scope.getRange(0, result.page_count);
      }
  });
}
var getFormatList = function () {
  AdminCampaignService.getFormatList().then(function (result) {
      $scope.formatList = result;
  });
}
getFormatList();
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
         } else if ($scope.pagination.pageNo >= ($scope.pagination.pageCount - mid) && $scope.pagination.pageNo <= $scope.pagination.pageCount) {
             lowest = $scope.pagination.pageCount - pageLinks;
         } else if ($scope.pagination.pageNo > 0 && $scope.pagination.pageNo <= pageLinks / 2) {
             lowest = 1;
         } else {
             lowest = $scope.pagination.pageNo - mid + 1;
         }
         highest = $scope.pagination.pageCount < $scope.pagination.pageSize ? $scope.pagination.pageCount : lowest + pageLinks;
         $scope.pagination.pageArray = _.range(lowest, highest + 1);
     }
 
     /*===================
      | Pagination Ends
      ===================*/
// Filter-code ends
// Share Campagin
$scope.shareCampaignToEmail = function (ev, shareCampaign, campaignID) {
  $scope.campaignToShare = $scope.campaignDetails;
  var campaignToEmail = {
      campaign_id: campaignID,
      email: shareCampaign.email,
      receiver_name: shareCampaign.receiver_name,
      //campaign_type: $scope.campaignToShare.type
  };
  CampaignService.shareCampaignToEmail(campaignToEmail).then(function (result) {
      if (result.status == 1) {
          $mdSidenav('shareCampaignSidenav').close();
          $mdDialog.show(
                  $mdDialog.alert()
                  .parent(angular.element(document.querySelector('body')))
                  .clickOutsideToClose(true)
                  .title(result.message)
                  // .textContent('You can specify some description text in here.')
                  .ariaLabel('Alert Dialog Demo')
                  .ok('Got it!')
                  .targetEvent(ev)
                  );
      } else {
          toastr.error(result.message);
      }
  });
}

$scope.toggleShareCampaignSidenav = function (campaign) {

  $scope.currentAdminShareCampaign = campaign;
  $mdSidenav('shareCampaignSidenav').toggle();
};

// Share Campagin-ends
  /*
  //////// Floating campaign section
  */

  $scope.formRows = [{ formId: '1', name: 'floatginCampaignForm1' }];
  $scope.addNewFormRow = function () {
    var newItemNo = $scope.formRows.length + 2;
    $scope.formRows.push({ 'formId': newItemNo, 'name': 'floatingCampaignForm' + newItemNo });
  };

  $scope.generateFloatingCampaignPdf = function () {
    Upload.upload({
      url: config.apiPath + '/floating-campaign-pdf',
      data: { product_arr: $scope.formRows },
      responseType: "arraybuffer"
    }).then(function (result) {
      if (result.data) {
        var campaignPdf = new Blob([result.data], { type: 'application/pdf;charset=utf-8' });
        FileSaver.saveAs(campaignPdf, 'Campaigns Proposal.pdf');
      }
      else {
        toastr.error(result.message);
      }
    }, function (resp) {
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    });
  }

  /*
  //////// Floating campaign section ends
  */

  /*====================================
  | Metro Campaigns
  ====================================*/
  var getFormatList = function (obj) {
    ProductService.getFormatList(obj).then(function (result) {
      $scope.formatList = result;
    });
  }
  function getMetroCorridors() {
    AdminMetroService.getMetroCorridors().then(function (result) {
      $scope.metroCorridorList = result;
      $scope.selectedCorridor = $scope.metroCorridorList[0];
      $scope.getMetroPackages($scope.selectedCorridor.id);
    });
  }
  $scope.selectPackage = function (pkg) {
    $scope.selectedPackage = pkg;
  }
  $scope.monthoptions = [
    {value: '.5', label: '15 Days'}, {value: '1', label: '1 Month'},{value: '2', label: '2 Months'},{value: '3', label: '3 Months'},{value: '4', label: '4 Months'},{value: '5', label: '5 Months'},{value: '6', label: '6 Months'},{value: '7', label: '7 Months'},{value: '8', label: '8 Months'}, {value: '9', label: '9 Months'},{value: '10', label: '10 Months'},{value: '11', label: '11 Months'},{value: '12', label: '12 Months'}];

  $scope.getMetroPackages = function (corridorId) {
    AdminMetroService.getMetroPackages(corridorId).then(function (result) {
      _.map(result, (res) => {
        res.selected_trains = 1;
       // res.selected_slots = 1;
       res.months = $scope.monthoptions[0];
        return res;
      });
      $scope.metroPackages = result;
      $scope.selectedPackage = result[0];
      //$scope.selectedPackage.days = "7";
      /*$scope.admin_selected_slots = ($scope.selectedPackage.max_slots * $scope.selectedPackage.days);
      $scope.admin_price = ($scope.selectedPackage.price * $scope.selectedPackage.days);*/
    });
  }
  function getMetroCampaigns() {
    AdminMetroService.getMetroCampaigns().then((result) => {
      $scope.userMetroCampaigns = _.filter(result, (campaign) => {
        return campaign.type == 0;
      });
      $scope.adminMetroCampaigns = _.filter(result, (campaign) => {
        return campaign.type == 1;
      });
    });
  }
  function getMetroCampaignDetails(metroCampaignId) {
    AdminMetroService.getMetroCampaignDetails(metroCampaignId).then((result) => {
      $scope.metroCampaignDetails = result;
    });
  }
  $scope.addPackageInMetroCampaign = function (slots,price) {
    $scope.selectedPackage.package_id = $scope.selectedPackage.id;
    $scope.selectedPackage.campaign_id = $scope.metroCampaignDetails.id;
    $scope.selectedPackage.months = $scope.selectedPackage.months.value;
    if(slots){
      $scope.selectedPackage.admin_slots = slots;
    }
    if(price){
      $scope.selectedPackage.admin_price = price;
    }
    //$scope.selectedPackage.total_price = $scope.selectedPackage.price * ($scope.selectedPackage.selected_trains + $scope.selectedPackage.selected_slots - 1);
    AdminMetroService.addPackageInMetroCampaign($scope.selectedPackage).then((result) => {
      if (result.status == 1) {
        $scope.selectedPackage = {};
        getMetroCampaignDetails($scope.metroCampaignDetails.id);
        toastr.success(result.message);
      }
      else {
        toastr.error(result.message);
      }
    });
  }

  /*$scope.updatePackagePrice = function (price,package1) {
    $scope.package_price = {};
    $scope.package_price = package1;
    $scope.package_price.price = price;
    $scope.package_price.edit_id = package1._id;
    AdminMetroService.addPackageInMetroCampaign($scope.package_price).then((result) => {
      if (result.status == 1) {
        $scope.selectedPackage = {};
        getMetroCampaignDetails($scope.metroCampaignDetails.id);
        toastr.success(result.message);
      }
      else {
        toastr.error(result.message);
      }
    });
  }*/

  $scope.updatePackagePrice = function(price,package1){
    var productObj = {
      id: $scope.metroCampaignDetails.id,
      start_date: package1.start_date,
      price: price,
      edit_id: package1._id
    };
    $mdDialog.show({
      locals:{ campaign: $scope.campaignDetails, productObj : productObj, ctrlScope : $scope },
      templateUrl: 'views/admin/edit-metro-proposed-product.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
      controller:function($scope, $mdDialog, CampaignService, AdminMetroService, ctrlScope,  productObj){
        $scope.product = productObj;
        $scope.AdminProposalFromMinDate = new Date();
        $scope.AdminProposalStartDate = new Date($scope.product.start_date);
        $scope.updateProposedProduct = function(product){
         /* AdminCampaignService.updateProposedProduct(campaign.id, $scope.product).then(function(result){
            if(result.status == 1){
              // update succeeded. update the grid now.
              $mdDialog.hide();
              CampaignService.getCampaignWithProducts(campaign.id).then(function(result){
                ctrlScope.campaignDetails = result;
                ctrlScope.campaignProducts = result.products;
                // setDatesForAdminProposalToSuggest($scope.campaignDetails);
              });
              toastr.success(result.message);
            }
            else{
              toastr.error(result.message);
            }
          });*/
          AdminMetroService.addPackageInMetroCampaign(product).then((result) => {
            if (result.status == 1) {
              $scope.selectedPackage = {};
              getMetroCampaignDetails(product.id);
              toastr.success(result.message);
            }
            else {
              toastr.error(result.message);
            }
          });
        }
        $scope.closeMdDialog = function(){
          $mdDialog.hide();
        }
      }
    });
  }
  $scope.showConfirmMetroPaymentPopup = function () {
    $mdDialog.show({
      templateUrl: 'views/admin/confirm-metro-payment-popup.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      preserveScope: true,
      locals: { metroCampaignId: $stateParams.metroCampaignId, ctrlScope: $scope },
      controller: function ($scope, $mdDialog, CampaignService, AdminCampaignService, ctrlScope, metroCampaignId) {
        $scope.paymentTypes = [
          { name: "Cash" },
          { name: "Cheque" },
          { name: "Online" },
          { name: "Transfer" }
        ];
        $scope.updateCampaignPayment = function () {
          $scope.campaignPayment.metro_campaign_id = metroCampaignId;
          AdminCampaignService.updateMetroCampaignStatus($scope.campaignPayment).then(function (result) {
            if (result.status == 1) {
              toastr.success(result.message);
              getMetroCampaignDetails(metroCampaignId);
              loadCampaignPayments(metroCampaignId);
              $mdDialog.hide();
            }
            else {
              toastr.error(result.message);
            }
          });
        }
        $scope.closeMdDialog = function(){
          $mdDialog.hide();
        }
      }
    });
  }
  $scope.saveUserCampaign = function (AdminownerCampaign) {
    AdminCampaignService.saveUserCampaign(AdminownerCampaign).then(function (result) {     
      if (result.status == 1) {          
        getAllCampaigns();      
        toastr.success(result.message);
      }
      else if (result.status == 0) {
        $rootScope.closeMdDialog();
        if (result.message.constructor == Array) {
          $scope.adminCampaignErrors = result.message;
        }
        else {
          toastr.error(result.message);
        }
      }
      else {
        toastr.error(result.message);
      }
      //myFunction();
    });
  }
//   function myFunction() {
//     document.getElementById("myDropdown").classList.toggle("show");
// }
// var loadOwnerCampaigns = function () {
//   return new Promise((resolve, reject) => {
//     AdminCampaignService.getAllCampaigns().then(function (result) {
//           $scope.ownerCampaigns = result;        
//           $scope.ownerCampaigns = _.filter(result, function (c) {
//               return c.status < 800;
//           });
//           $scope.scheduledCampaigns = _.filter(result, function (c) {
//               return c.status >= 800;
//           });
//           resolve(result);
//       });
//   });
// }
  $scope.launchMetroCampaign = function (campaignId, ev) {
    AdminCampaignService.launchMetroCampaign(campaignId).then(function (result) {
      if (result.status == 1) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('body')))
            .clickOutsideToClose(true)
            .title("Congrats!!")
            .textContent(result.message)
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
            .targetEvent(ev)
        );
        getMetroCampaignDetails(campaignId);
      }
      else {
        toastr.error(result.message);
      }
    });
  }
  $scope.saveMetroCampaign = function (campaign) {
    MetroService.saveMetroCampaign(campaign).then(function (response) {
      if (response.status == 1) {
        $scope.campaignSavedSuccessfully = true;
        $scope.metroCampaign = {};
        $scope.metroCampaignForm.$setPristine();
        $scope.metroCampaignForm.$setUntouched();
        $scope.campaignSavedSuccessfully = false;
        toastr.success(response.message);
        $mdSidenav('metroAddCmapginSidenav').close();
        getMetroCampaigns();
      }
      else {
        $scope.saveUserCampaignErrors = response.message;
        toastr.error(response.message);
      }
    });
  }
  $scope.closeMetroCampaign = function (campaignId) {
    if ($window.confirm("Are you sure you want to close this campaign?")) {
      AdminMetroService.closeMetroCampaign(campaignId).then(function (response) {
        if (response.status == 1) {
          $scope.campaignSavedSuccessfully = true;
          $scope.metroCampaign = {};
          toastr.success(response.message);
          getMetroCampaignDetails(campaignId);
        }
        else {
          //$scope.saveUserCampaignErrors = response.message;
          toastr.error(response.message);
        }
      });
    } 
    else {
      $scope.Message = "You clicked NO.";
    }
  }
  $scope.deleteProductFromCampaign = function (campaignId, productId) {
    if ($window.confirm("Are you sure you want to delete this package?")) {
      MetroService.deleteMetroPackageFromCampaign(campaignId, productId).then(function (result) {
        if (result.status == 1) {
          getMetroCampaignDetails(campaignId);
          loadCampaignPayments($stateParams.metroCampaignId);
          toastr.success(result.message);
        }
        else {
          toastr.error(result.message);
        }
      });
    } else {
      $scope.Message = "You clicked NO.";
    }
  }
  $scope.deleteMetroCampaign = function (campaignId) {
    if ($window.confirm("Are you really want to delete this camapaign?")) {
      CampaignService.deleteMetroCampaign(campaignId).then(function (result) {
        if (result.status == 1) {
          getMetroCampaigns();
          toastr.success(result.message);
        }
        else {
          toastr.error(result.message);
        }
      });
    } else {
      $scope.Message = "You clicked NO.";
    }
  }

  /*====================================
  | Metro Campaigns end
  ====================================*/

  $scope.cancel = function () {
    $mdDialog.hide();
  };
  // query tab
  AdminContactService.userQuery().then(function (response) {    
    $scope.QueriesData = response.data;
  });
  // query tab end
  AdminCampaignService.getAllCampaigns().then(function (response) {
    $scope.adminpayments = response.admin_campaigns;
  });
  /*=========================
  | Page based initial loads
  =========================*/
  if ($rootScope.currStateName == "admin.campaign-proposal-summary") {
    if ($stateParams.campaignId) {
      var campaignId = $stateParams.campaignId;
      CampaignService.getCampaignWithProducts(campaignId).then(function (result) {

      });
    }
  }
  if ($rootScope.currStateName == "admin.metro-campaigns") {
    getMetroCampaigns();
  }
  if ($rootScope.currStateName == "admin.metro-campaign") {
    if ($stateParams.metroCampaignId) {
      getMetroCampaignDetails($stateParams.metroCampaignId);
    }
    getMetroCorridors();
    getFormatList({ type: "metro" });
  }
  /*=============================
  | Page based initial loads end
  =============================*/

  function loadCampaignPayments(campaignId) {
    console.log(campaignId);
    AdminCampaignService.getCampaignPaymentDetails(campaignId).then(function (result) {
      if (result.all_payments && result.all_payments.length >= 1) {
        $scope.campaignPayments = result;
        $scope.campaignMetroPayments = result;
      } else {
        toastr.error(result.message);
      }
    });
  }
  loadCampaignPayments($stateParams.metroCampaignId);
   /**********      Payments  */
   if ($rootScope.currStateName == "admin.campaign-payment-details") {
    CampaignService.getCampaignWithProducts($stateParams.campaign_id).then(function(result){
      $scope.campaignDetails = result;
    });
    loadCampaignPayments($stateParams.campaign_id);
    
  }
  
  $scope.paymentTypes = [
    {name: "Cash"},
    {name: "Cheque"},
    {name: "Online"},
    {name: "Transfer"}
  ];
  $scope.files = {};
  $scope.updateCampaignPayment = function (cid) {
    $scope.campaignPayment.campaign_id = cid;
      Upload.upload({
          url: config.apiPath + '/campaign-payment',
          data: {image: $scope.files.image, campaign_payment: $scope.campaignPayment}
      }).then(function (result) {
          if (result.data.status == "1") {
              toastr.success(result.data.message);
              $scope.campaignPayment = {};
              $scope.files.image = "";
              /*setTimout(() => {
                  $location.path('/owner/' + $rootScope.clientSlug + '/payments');
              }, 2500);*/
              loadCampaignPayments(cid);
          } else {
              if (result.data.message.constructor == Array) {
                  $scope.updateCampaignPaymentErrors = result.data.message;
              } else {
                  toastr.error(result.data.message);
              }
          }
      }, function (resp) {
          toastr.error("somthing went wrong try again later");
      }, function (evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      });
  }
  $scope.getCampaignList = function(){
    var productId = $stateParams.productId;
    AdminCampaignService.getCampaignsFromProducts(productId).then(function (result) {
      if(result){
          $scope.shortlistedproduct = result;
        //toastr.success(result.message);        
      }
      else{
        toastr.error(result.data.message);
      }
    });
  }
  if($location.$$path.search("product-shortlist-campagin") !== -1){
    $scope.getCampaignList();
  }

  $scope.loadCampaignData = function(campaignId){
    return new Promise(function(resolve, reject){
      CampaignService.getCampaignWithProducts(campaignId).then(function(result){
        $scope.campaignDetails = result;
        //$scope.campaignProducts = result.products;
        // setDatesForProductsToSuggest($scope.campaignDetails);
        // if(result.status > 7){
        //   loadCampaignPayments(campaignId);
        // }
        resolve(result);
      
      });
    })
  }
  if($stateParams.campaignId){
    var campaignId = $stateParams.campaignId;
    $scope.loadCampaignData(campaignId);
  }
// Date-Picker
$scope.getProductUnavailableDates = function (productId, ev) {
  AdminCampaignService.getProductUnavailableDates(productId).then(function (dateRanges) {
      $scope.unavailalbeDateRanges = dateRanges;
      $(ev.target).parent().parent().find('input').trigger('click');
  });
}

$scope.suggestProductForAdminCampaign = function (adminProduct) {
  console.log(adminProduct);
  if($stateParams.campaignId) {
      var postObj = {
          campaign_id: $stateParams.campaignId,
          product: {
              id: adminProduct.id,
              booking_dates: adminProduct.booking_dates,
              price: adminProduct.default_price
          }
      }
      AdminCampaignService.proposeProductForCampaign(postObj).then(function (result) {
          console.log(result);
          if (result.status == 1) {
            CampaignService.getCampaignWithProducts(campaignId).then(function(result){
             // alert("dhajf");
                  $scope.campaignDetails = result;
                  _.map($scope.AdminProduct, function (product) {
                      if (product.id == adminProduct.id) {
                          product.alreadyAdded = true;
                      }
                     // console.log(product);
                      return product;
                  });
                  //console.log($scope.AdminProduct)
              });
              toastr.success(result.message);
          } else {
              toastr.error(result.message);
          }
      });
  }
}
/*================================
     | Multi date range picker options
     ================================*/
     $scope.suggestProductOpts = {
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
      isInvalidDate: function (dt) {
          for (var i = 0; i < $scope.unavailalbeDateRanges.length; i++) {
              if (moment(dt) >= moment($scope.unavailalbeDateRanges[i].booked_from) && moment(dt) <= moment($scope.unavailalbeDateRanges[i].booked_to)) {
                  return true;
              }
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
      },
  };
  /*====================================
   | Multi date range picker options end
   ====================================*/
// Date-Picker-END
  $scope.getProductList();  
});
