app.controller('OwnerCampaignCtrl', function ($scope, $mdDialog, $mdSidenav, $interval, $stateParams, $window, $rootScope, $location, Upload, OwnerCampaignService, OwnerProductService, toastr, CampaignService, config) {
  $scope.forms = [];
  $scope.serverUrl = config.serverUrl;

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
    }
    else if ($scope.pagination.pageNo >= ($scope.pagination.pageCount - mid) && $scope.pagination.pageNo <= $scope.pagination.pageCount) {
      lowest = $scope.pagination.pageCount - pageLinks;
    }
    else if ($scope.pagination.pageNo > 0 && $scope.pagination.pageNo <= pageLinks / 2) {
      lowest = 1;
    }
    else {
      lowest = $scope.pagination.pageNo - mid + 1;
    }
    highest = $scope.pagination.pageCount < $scope.pagination.pageSize ? $scope.pagination.pageCount : lowest + pageLinks;
    $scope.pagination.pageArray = _.range(lowest, highest + 1);
  }

  /*===================
  | Pagination Ends
  ===================*/


  /*=======================
  | MdDialogs and sidenavs
  =======================*/

  $scope.showPaymentdailog = function () {
    $mdDialog.show({
      templateUrl: 'views/updatepaymentDailog.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true
    })
  };
  // $scope.addOwnerCampagin = function (ev) {
  //   $mdDialog.show({
  //     templateUrl: 'views/owner/addcampaign.html',
  //     fullscreen: $scope.customFullscreen,
  //     clickOutsideToClose: true
  //   })
  // };
  $scope.ownerCampaign = {};
  $scope.toggleAddCamapginSidenav = function () {
    $mdSidenav('ownerAddCmapginSidenav').toggle();
  };

  $scope.cancel = function () {
    $mdDialog.hide();
  };
  $scope.sharePerson = false;
  $scope.shareCampaign = function () {
    $scope.sharePerson = !$scope.sharePerson;
  }

  $scope.showCampaignPaymentSidenav = function () {
    $mdSidenav('campaignPaymentDetailsSidenav').toggle();
  };

  //campaign share
  $scope.toggleShareCampaignSidenav = function () {
    $mdSidenav('shareCampaignSidenav').toggle();
  };

  /*===========================
  | MdDialogs and sidenavs end
  ===========================*/

  /*================================
  | Multi date range picker options
  ================================*/
  $scope.suggestProductOpts = {
    multipleDateRanges: true,
    opens: 'center',
    locale: {
        applyClass: 'btn-green',
        applyLabel: "Apply",
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

  ////data for image uploading 

  // $scope.data = {};
  // $scope.uploadFile = function (input) {
  //   $scope.data.fileName = input.files[0].name;
  //   if (input.files && input.files[0]) {
  //     var reader = new FileReader();
  //     reader.onload = function (e) {
  //       //Sets the Old Image to new New Image
  //       $('#photo-id').attr('src', e.target.result);
  //       //Create a canvas and draw image on Client Side to get the byte[] equivalent
  //       var canvas = document.createElement("canvas");
  //       var imageElement = document.createElement("img");
  //       imageElement.setAttribute('src', e.target.result);
  //       canvas.width = imageElement.width;
  //       canvas.height = imageElement.height;
  //       var context = canvas.getContext("2d");
  //       context.drawImage(imageElement, 0, 0);
  //       var base64Image = canvas.toDataURL("image/jpeg");
  //       //Removes the Data Type Prefix 
  //       //And set the view model to the new value
  //       $scope.data.uploadedPhoto = e.target.result.replace(/data:image\/jpeg;base64,/g, '');
  //       // console.log($scope.data.uploadedPhoto);
  //     }
  //     //Renders Image on Page
  //     reader.readAsDataURL(input.files[0]);
  //   }
  // };

  function setDatesForOwnerProductsToSuggest(campaign) {
    $scope.SuggestprodStartDate = new Date(campaign.start_date);
    $scope.SuggestprodEndDate = new Date(campaign.end_date);
    $scope.SuggestprodfromMinDate = moment(campaign.start_date).toDate();
    $scope.SuggestprodfromMaxDate = moment(campaign.end_date).toDate();
    $scope.SuggestprodfromMaxDate = moment(campaign.end_date).toDate();
  }
  function setMinMaxDatesForCamapign() {
    $scope.minStartDate = new Date();
    $scope.minEndDate = moment($scope.ownerCampaign.start_date).add(1, 'days').toDate();
    $scope.ownerCampaign.end_date = $scope.minEndDate;
    $scope.defaultStartDate = new Date();
  }
  $scope.updateEndDateValidations = function () {
    $scope.minEndDate = moment($scope.ownerCampaign.start_date).add(1, 'days').toDate();
    if ($scope.ownerCampaign.end_date <= $scope.ownerCampaign.start_date) {
      $scope.ownerCampaign.end_date = $scope.minEndDate;
    }
  }
  // get all Campaigns by a user to show it in campaign management page
  $scope.getUserCampaignsForOwner = function () {
    return new Promise((resolve, reject) => {
      OwnerCampaignService.getUserCampaignsForOwner().then(function (result) {      
        $scope.plannedCampaigns = _.filter(result, function (c) {
          return c.status < 600;
        });
        $scope.runningCampaigns = _.where(result, { status: 600 });
        $scope.closedCampaigns = _.filter(result, function (c) {
          return c.status > 600 && c.status <= 800;
        });
        resolve(result);
      });
    });
  }
  var loadOwnerCampaigns = function () {
    return new Promise((resolve, reject) => {
      OwnerCampaignService.getOwnerCampaigns().then(function (result) {
        $scope.ownerCampaigns = result;        
        resolve(result);
      });
    });
  }
  var loadOwnerProductList = function () {
    OwnerProductService.getApprovedProductList($scope.pagination.pageNo, $scope.pagination.pageSize).then(function (result) {
      if (localStorage.selectedOwnerCampaign) {
        var selectedOwnerCampaign = JSON.parse(localStorage.selectedOwnerCampaign);
        $scope.campaignStartDate = selectedOwnerCampaign.start_date;
        $scope.campaignEndDate = selectedOwnerCampaign.end_date;
        $scope.campaignEstBudget = selectedOwnerCampaign.est_budget;
        $scope.campaignActBudget = selectedOwnerCampaign.act_budget;
        if (selectedOwnerCampaign.products && selectedOwnerCampaign.products.length > 0) {
          _.map(result.products, function (p) {
            if (_.find(JSON.parse(localStorage.selectedOwnerCampaign).products, { id: p.id }) !== undefined) {
              p.alreadyAdded = true;
              return p;
            }
          });
        }
      }
      $scope.productList = result.products;
      $scope.pagination.pageCount = result.page_count;
      createPageLinks();
    });
  }
  // get all Campaigns by a user to show it in campaign management page ends  

  $scope.saveOwnerCampaign = function () {
    OwnerCampaignService.saveOwnerCampaign($scope.ownerCampaign).then(function (result) {
      if (result.status == 1) {
        $scope.ownerCampaign = {};
        $scope.forms.ownerCampaignForm.$setPristine();
        $scope.forms.ownerCampaignForm.$setUntouched();
        loadOwnerCampaigns();
        toastr.success(result.message);
      }
      else if (result.status == 0) {
        $rootScope.closeMdDialog();
        if (result.message.constructor == Array) {
          $scope.ownerCampaignErrors = result.message;
        }
        else {
          toastr.error(result.message);
        }
      }
      else {
        toastr.error(result.message);
      }
    });
  }

  $scope.suggestProductForOwnerCampaign = function (suggestedProduct) {
    if (!localStorage.selectedOwnerCampaign) {
      toastr.error("No Campaign is seleted. Please select which campaign you're adding this product in to.")
    }
    else {
      var postObj = {
        campaign_id: JSON.parse(localStorage.selectedOwnerCampaign).id,
        product: {
          id: suggestedProduct.id,
          booking_dates: suggestedProduct.booking_dates,
          price: suggestedProduct.price
        }
      };
      OwnerCampaignService.proposeProductForCampaign(postObj).then(function (result) {
        if (result.status == 1) {
          OwnerCampaignService.getOwnerCampaignDetails(JSON.parse(localStorage.selectedOwnerCampaign).id).then(function (updatedCampaignData) {
            localStorage.selectedOwnerCampaign = JSON.stringify(updatedCampaignData);
            $scope.campaignActBudget = updatedCampaignData.act_budget;
            _.map($scope.productList, function (product) {
              if (product.id == suggestedProduct.id) {
                product.alreadyAdded = true;
              }
              return product;
            });
          });
          toastr.success(result.message);
        }
        else {
          toastr.error(result.message);
        }
      });
    }
  }

  $scope.getProductUnavailableDates = function(productId, ev){
    OwnerProductService.getProductUnavailableDates(productId).then(function(dateRanges){
      $scope.unavailalbeDateRanges = dateRanges;
      $(ev.target).parent().parent().find('input').trigger('click');
    });
  }

  /* ============================
  | Campaign details section
  ============================= */

  $scope.campaignDetails = {};

  $scope.getUserCampaignDetails = function (campaignId) {
    OwnerCampaignService.getCampaignWithProductsForOwner(campaignId).then(function (result) {
      $scope.campaignDetails = result;
    });
  }
  $scope.getOwnerCampaignDetails = function (campaignId) {
    OwnerCampaignService.getOwnerCampaignDetails(campaignId).then(function (result) {     
      $scope.campaignDetails = result;
    });
  }

  $scope.viewProductImage = function (image) {
    var imagePath = config.serverUrl + image;
    $mdDialog.show({
      locals: { src: imagePath },
      templateUrl: 'views/image-popup-large.html',
      preserveScope: true,
      scope: $scope,
      fullscreen: $scope.customFullscreen,      
      clickOutsideToClose: true,
      controller: function ($scope, src) {
        $scope.img_src = src;
      }
    });
  }
  $scope.closeDialog = function() {
    $mdDialog.hide();
  }
  $scope.finalizeCampaign = function () {
    OwnerCampaignService.finalizeCampaignByOwner($scope.campaignDetails.id).then(function (result) {
      if (result.status == 1) {
        toastr.success("Campaign Finalized!");
      }
      else {
        toastr.error(result.message);
      }
    });
  }

  $scope.editProposedProduct = function (productId, from_date, to_date, price) {
    var productObj = {
      id: productId,
      from_date: $scope.campaignDetails.start_date,
      to_date: $scope.campaignDetails.end_date,
      price: price
    };
    $mdDialog.show({
      locals: { campaign: $scope.campaignDetails, productObj: productObj, ctrlScope: $scope },
      templateUrl: 'views/owner/edit-proposed-product.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose: true,
      controller: function ($scope, $mdDialog, ctrlScope, campaign, productObj) {
        $scope.product = productObj;
        $scope.OwnerProposalStartDate = new Date(campaign.start_date);
        $scope.OwnerProposalEndDate = new Date(campaign.end_date);
        $scope.OwnerProposalFromMinDate = moment(campaign.start_date).toDate();
        $scope.OwnerProposalFromMaxDate = moment(campaign.end_date).toDate();
        $scope.OwnerProposaltoMinDate = moment($scope.product.start_date).toDate();
        $scope.OwnerProposalToMaxDate = moment(campaign.end_date).toDate();
        $scope.updateProposedProduct = function (product) {
          OwnerCampaignService.updateProposedProduct(campaign.id, $scope.product).then(function (result) {
            if (result.status == 1) {
              // update succeeded. update the grid now.
              if (campaign.type != "2") {
                ctrlScope.getUserCampaignDetails(campaign.id);
              }
              else {
                ctrlScope.getOwnerCampaignDetails(campaign.id);
              }
              $mdDialog.hide();
              toastr.success(result.message);
            }
            else {
              toastr.error(result.message);
            }
          });
        }
        $scope.closeMdDialog = function () {
          $mdDialog.hide();
        }
      }
    });
  }
  $scope.addNewProductToCampaign = function () {
    localStorage.selectedOwnerCampaign = JSON.stringify($scope.campaignDetails);
    $location.path('/owner/' + $rootScope.clientSlug + '/add-campagin-product');
  }

  $scope.removeProductFromCampaignSuggestion = function (productId) {
    var campaignId = JSON.parse(localStorage.selectedOwnerCampaign).id;
    OwnerCampaignService.deleteProductFromCampaign(campaignId, productId).then(function (result) {
      if (result.status == 1) {
        OwnerCampaignService.getOwnerCampaignDetails(JSON.parse(localStorage.selectedOwnerCampaign).id).then(function (updatedCampaignData) {
          localStorage.selectedOwnerCampaign = JSON.stringify(updatedCampaignData);
          $scope.campaignActBudget = updatedCampaignData.act_budget;
          _.map($scope.productList, function (product) {
            if (product.id == productId) {
              product.alreadyAdded = false;
            }
            return product;
          });
        });
        toastr.success(result.message);
      }
      else {
        toastr.error(result.message);
      }
    });
  }

  $scope.bookOwnerCampaign = function (campaignId, ev) {
    OwnerCampaignService.bookNonUserCampaign(campaignId).then(function (result) {
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
        $scope.getOwnerCampaignDetails(campaignId);
      }
      else {
        if (result.product_ids && result.product_ids.length > 0) {
          toastr.error(result.message);
          _.map($scope.campaignDetails.products, (p) => {
            if (_.contains(result.product_ids, p.product_id)) {
              p.unavailable = true;
            }
          });
        }
        else {
          toastr.error(result.message);
        }
      }
    });
  }

  $scope.deleteOwnerCampaign = function (campaignId) {
    OwnerCampaignService.deleteOwnerCampaign(campaignId).then(function (result) {
      if (result.status == 1) {
        loadOwnerCampaigns();
        toastr.success(result.message);
      }
      else {
        toastr.error(result.message);
      }
    })
  }

  $scope.closeCampaign = function (campaignId, ev) {
    OwnerCampaignService.closeCampaign(campaignId).then(function (result) {
      if (result.status == 1) {
        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('body')))
            .clickOutsideToClose(true)
            .title("Success!!")
            .textContent(result.message)
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
            .targetEvent(ev)
        );
        $scope.getOwnerCampaignDetails(campaignId);
      }
      else {
        toastr.error(result.message);
      }
    });
  }

  $scope.deleteProductFromCampaign = function (campaignId, productId) {
    OwnerCampaignService.deleteProductFromCampaign(campaignId, productId).then(function (result) {
      if (result.status == 1) {
        if ($stateParams.campaignType == 2) {
          $scope.getOwnerCampaignDetails(campaignId);
        }
        else {
          $scope.getUserCampaignDetails(campaignId);
        }
        toastr.success(result.message);
      }
      else {
        toastr.error(result.message);
      }
    });
  }

  /* ==============================
  | Campaign details section ends
  =============================== */


  /* ==============================
  | Campaign payment section
  =============================== */
  function getCampaignWithPayments() {
    OwnerCampaignService.getCampaignWithPayments().then(function (result) {
      $scope.campaignsWithPayments = result;
    });
  }

  $scope.getCampaignPaymentDetails = function (campaignId) {
    localStorage.campaignPaymentDetailsCampaignId= campaignId;
    OwnerCampaignService.getCampaignPaymentDetails(campaignId).then(function (result) {
      //$scope.showCampaignPaymentSidenav();
      $scope.campaignPaymentDetails = result;     
      var campaignPayments = $scope.campaignPaymentDetails.payment_details;
      $scope.paid = 0;
      _.each(campaignPayments, function (p) {
        $scope.paid += p.amount;
      });
      $scope.unpaid = $scope.campaignPaymentDetails.act_budget - $scope.paid;
    });
  }

  $scope.paymentTypes = [
    { name: "Cash" },
    { name: "Cheque" },
    { name: "Online" },
    { name: "Transfer" }
  ];
  $scope.files = {};
  $scope.updateOwnerCampaignPayment = function () {
    Upload.upload({
      url: config.apiPath + '/update-campaign-payment-owner',
      data: { image: $scope.files.image, campaign_payment: $scope.campaignPayment }
    }).then(function (result) {
      if (result.data.status == "1") {
        toastr.success(result.data.message);
        $scope.campaignPayment = {};
        $scope.files.image = "";
        setTimout(() => {
          $location.path('/owner/' + $rootScope.clientSlug + '/payments');
        }, 2500);
      }
      else {
        if (result.data.message.constructor == Array) {
          $scope.updateCampaignPaymentErrors = result.data.message;
        }
        else {
          toastr.error(result.data.message);
        }
      }
    }, function (resp) {
      toastr.error("somthing went wrong try again later");
      // console.log('Error status: ', resp);
    }, function (evt) {
      var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.image.name);
    });
  }

  /* ==============================
  | Campaign payment section ends
  =============================== */


  /*==============================
  | Campaign Search
  ==============================*/
  // $scope.simulateQuery = false;
  $scope.isDisabled = false;
  // $scope.querySearch   = querySearch;
  // $scope.selectedItemChange = selectedItemChange;
  // $scope.searchTextChange   = searchTextChange;


  $scope.campaignSearch = function (query) {
    return OwnerCampaignService.searchCampaigns(query.toLowerCase()).then(function (res) {
      return res;
    });
  }

  $scope.viewSelectedCampaign = function (campaign) {
    $location.path('/owner/' + $rootScope.clientSlug + '/campaign-details/' + campaign.id + "/" + campaign.type);
  }
  $scope.shareCampaignToEmail = function (ev, shareCampaign) {
    $scope.campaignToShare = $scope.campaignDetails;
    var campaignToEmail = {
      campaign_id: $scope.campaignToShare.id,
      email: shareCampaign.email,
      receiver_name: shareCampaign.receiver_name,
      campaign_type: $scope.campaignToShare.type
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
      }
      else {
        toastr.error(result.message);
      }
    });
  }
  //campaign share closed
  function selectedItemChange(item) {
    //console.log('Item changed to ' + JSON.stringify(item));
  }
  /*==============================
  | Campaign Search
  ==============================*/


  /*=========================
  | Page based initial loads
  =========================*/
  if ($rootScope.currStateName == "owner.campaigns") {
    $scope.getUserCampaignsForOwner();
    loadOwnerCampaigns();
    setMinMaxDatesForCamapign();
  }
  if ($rootScope.currStateName == "owner.bbi-campaigns") {
    $scope.getUserCampaignsForOwner();
  }
  if ($rootScope.currStateName == "owner.add-campagin-product") {
    loadOwnerProductList();
    $scope.selectedOwnerCampaign = JSON.parse(localStorage.selectedOwnerCampaign);
  }
  if (typeof $stateParams.campaignId !== 'undefined' && typeof $stateParams.campaignType !== 'undefined') {
    if ($stateParams.campaignType == 2) {
      $scope.getOwnerCampaignDetails($stateParams.campaignId);
    }
    else {
      $scope.getUserCampaignDetails($stateParams.campaignId);
    }
  }

  if ($rootScope.currStateName == 'owner.payments') {
    getCampaignWithPayments();
  }

  if($rootScope.currStateName == 'owner.updatepayment'){
    $scope.getCampaignPaymentDetails (localStorage.campaignPaymentDetailsCampaignId)
  }
  if ($rootScope.currStateName == 'owner.update-payments') {
    $scope.allCampaignsForOwner = [];
    loadOwnerCampaigns().then(function (result) {
      $scope.getUserCampaignsForOwner().then(function (result2) {
        $scope.allCampaignsForOwner = _.filter(result.concat(result2), function (c) {
          return c.status >= 6;
        });
      });
    })
  }

  /*=============================
  | Page based initial loads end
  =============================*/
//page width
  $scope.innerWidth = $window.innerWidth;
});