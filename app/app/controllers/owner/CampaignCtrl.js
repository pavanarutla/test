app.controller('OwnerCampaignCtrl', function ($scope, $mdDialog,$mdSidenav, $interval, $stateParams, $window, $rootScope, $location, Upload, OwnerCampaignService, OwnerProductService, toastr) {
  $scope.forms = [];

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
    $scope.pagination.pageArray = _.range(lowest, highest);
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

  $scope.showCampaignPaymentSidenav = function() {
    $mdSidenav('campaignPaymentDetailsSidenav').toggle();
  };

  /*===========================
  | MdDialogs and sidenavs end
  ===========================*/

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

  // get all Campaigns by a user to show it in campaign management page
  $scope.getUserCampaignsForOwner = function () {
    return new Promise((resolve, reject) => {
      OwnerCampaignService.getUserCampaignsForOwner().then(function (result) {
        $scope.plannedCampaigns = _.filter(result, function(c){
          return c.status < 6;
        });
        $scope.runningCampaigns = _.where(result, { status: 6 });
        $scope.closedCampaigns = _.filter(result, function(c){
          return c.status > 6 && c.status <= 8;
        });
        resolve(result);
      });
    });
  }
  var loadOwnerCampaigns = function(){
    return new Promise((resolve, reject) => {
      OwnerCampaignService.getOwnerCampaigns().then(function(result){
        $scope.ownerCampaigns = result;
        resolve(result);
      });
    });
  }
  var loadOwnerProductList = function(){
    OwnerProductService.getApprovedProductList($scope.pagination.pageNo, $scope.pagination.pageSize).then(function(result){
      if(localStorage.selectedOwnerCampaign){
        var selectedOwnerCampaign = JSON.parse(localStorage.selectedOwnerCampaign);
        $scope.campaignStartDate = selectedOwnerCampaign.start_date;
        $scope.campaignEndDate = selectedOwnerCampaign.end_date;
        $scope.campaignEstBudget = selectedOwnerCampaign.est_budget;
        $scope.campaignActBudget = selectedOwnerCampaign.act_budget;
        if(selectedOwnerCampaign.products && selectedOwnerCampaign.products.length > 0){
          _.map(result.products, function(p){
            console.log(p);
            if(_.find(JSON.parse(localStorage.selectedOwnerCampaign).products, {id: p.id}) !== undefined){
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

  $scope.saveOwnerCampaign = function(){
    OwnerCampaignService.saveOwnerCampaign($scope.ownerCampaign).then(function(result){
      if(result.status == 1){
        $scope.ownerCampaign = {};
        $scope.forms.ownerCampaignForm.$setPristine();
        $scope.forms.ownerCampaignForm.$setUntouched();
        loadOwnerCampaigns();
        toastr.success(result.message);
      }
      else if(result.status == 0){
        $rootScope.closeMdDialog();
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

  $scope.suggestProductForCampaign = function(suggestedProduct){
    if(!localStorage.selectedOwnerCampaign){
      toastr.error("No Campaign is seleted. Please select which campaign you're adding this product in to.")
    }
    else{
      var postObj = {
        campaign_id: JSON.parse(localStorage.selectedOwnerCampaign).id,
        product:{
          id: suggestedProduct.id,
          from_date: suggestedProduct.start_date,
          to_date:  suggestedProduct.end_date,
          price: suggestedProduct.price
        }
      };
      OwnerCampaignService.proposeProductForCampaign(postObj).then(function(result){
        if(result.status == 1){
          OwnerCampaignService.getOwnerCampaignDetails(JSON.parse(localStorage.selectedOwnerCampaign).id).then(function(updatedCampaignData){
            localStorage.selectedOwnerCampaign = JSON.stringify(updatedCampaignData);
            $scope.campaignActBudget = updatedCampaignData.act_budget;
            _.map($scope.productList, function(product){
              if(product.id == suggestedProduct.id){
                product.alreadyAdded = true;             
              }
              return product;
            });
          });
          toastr.success(result.message);
        }
        else{
          toastr.error(result.message);
        }
      });
    }
  }

  /* ============================
  | Campaign details section
  ============================= */
  
  $scope.campaignDetails = {};

  $scope.getUserCampaignDetails = function(campaignId){
    OwnerCampaignService.getCampaignWithProductsForOwner(campaignId).then(function(result){
      $scope.campaignDetails = result;
    });
  }
  $scope.getOwnerCampaignDetails = function(campaignId){
    OwnerCampaignService.getOwnerCampaignDetails(campaignId).then(function(result){
      $scope.campaignDetails = result;
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
      }
    });
  }

  $scope.finalizeCampaign = function(){
    OwnerCampaignService.finalizeCampaignByOwner($scope.campaignDetails.id).then(function(result){
      if(result.status == 1){
        toastr.success("Campaign Finalized!");
      }
      else{
        toastr.error(result.message);
      }
    });
  }

  $scope.editProposedProduct = function(productId, from_date, to_date, price){
    var productObj = {
      id: productId,
      from_date: from_date,
      to_date: to_date,
      price: price
    };
    $mdDialog.show({
      locals:{ campaign: $scope.campaignDetails, productObj : productObj, ctrlScope : $scope },
      templateUrl: 'views/owner/edit-proposed-product.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
      controller:function($scope, $mdDialog, ctrlScope, campaign, productObj){
        $scope.product = productObj;
        $scope.updateProposedProduct = function(product){
          OwnerCampaignService.updateProposedProduct(campaign.id, $scope.product).then(function(result){
            if(result.status == 1){
              // update succeeded. update the grid now.
              if(campaign.type != "2"){
                ctrlScope.getUserCampaignDetails(campaign.id);
              }
              else{
                ctrlScope.getOwnerCampaignDetails(campaign.id);
              }
              $mdDialog.hide();
              toastr.success(result.message);
            }
            else{
              toastr.error(result.message);
            }
          });
        }
        $scope.cancel = function(){
          $mdDialog.hide();
        }
      }
    });
  }

  $scope.addNewProductToCampaign = function(){
    localStorage.selectedOwnerCampaign = JSON.stringify($scope.campaignDetails);
    $location.path('/owner/' + $rootScope.clientSlug + '/suggest-products');
  }

  $scope.removeProductFromCampaignSuggestion = function(productId){
    var campaignId = JSON.parse(localStorage.selectedOwnerCampaign).id;
    OwnerCampaignService.deleteProductFromCampaign(campaignId, productId).then(function(result){
      if(result.status == 1){
        OwnerCampaignService.getOwnerCampaignDetails(JSON.parse(localStorage.selectedOwnerCampaign).id).then(function(updatedCampaignData){
          localStorage.selectedOwnerCampaign = JSON.stringify(updatedCampaignData);
          $scope.campaignActBudget = updatedCampaignData.act_budget;
          _.map($scope.productList, function(product){
            if(product.id == suggestedProduct.id){
              product.alreadyAdded = false;             
            }
            return product;
          });
        });
        toastr.success(result.message);
      }
      else{
        toastr.error(result.message);
      }
    });
  }

  $scope.launchOwnerCampaign = function(campaignId, ev){
    OwnerCampaignService.launchCampaign(campaignId).then(function(result){
      if(result.status == 1){
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
      else{
        toastr.error(result.message);
      }
    });
  }

  $scope.deleteOwnerCampaign = function(campaignId){
    OwnerCampaignService.deleteOwnerCampaign(campaignId).then(function(result){
      if(result.status == 1){
        loadOwnerCampaigns();
        toastr.success(result.message);
      }
      else{
        toastr.error(result.message);
      }
    })
  }

  /* ==============================
  | Campaign details section ends
  =============================== */


  /* ==============================
  | Campaign payment section
  =============================== */
  function getCampaignWithPayments(){
    OwnerCampaignService.getCampaignWithPayments().then(function(result){
      $scope.campaignsWithPayments = result;
    });
  }

  $scope.getCampaignPaymentDetails = function(campaignId){
    OwnerCampaignService.getCampaignPaymentDetails(campaignId).then(function(result){
      $scope.showCampaignPaymentSidenav();
      $scope.campaignPaymentDetails = result;
      var campaignPayments = $scope.campaignPaymentDetails.payment_details;
      $scope.paid = 0;
      _.each(campaignPayments, function(p){
        $scope.paid += p.amount;
      });
      $scope.unpaid = $scope.campaignPaymentDetails.act_budget - $scope.paid; 
    });
  }

  $scope.paymentTypes = [
    {name: "Cash"},
    {name: "Cheque"},
    {name: "Online"},
    {name: "Transfer"}
  ];
  $scope.files = {};  
  $scope.updateOwnerCampaignPayment = function () {
    Upload.upload({
      url: config.apiPath + '/update-campaign-payment-owner',
      data: { image: $scope.files.image, campaign_payment: $scope.campaignPayment }
    }).then(function (result) {
      if(result.data.status == "1"){
        toastr.success(result.data.message);
        $scope.campaignPayment = {};
        $scope.files.image = "";
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
  }

  /* ==============================
  | Campaign payment section ends
  =============================== */


  /*==============================
  | Campaign Search
  ==============================*/
  // $scope.simulateQuery = false;
  $scope.isDisabled    = false;
  // $scope.querySearch   = querySearch;
  // $scope.selectedItemChange = selectedItemChange;
  // $scope.searchTextChange   = searchTextChange;


  $scope.campaignSearch = function(query) {
    return OwnerCampaignService.searchCampaigns(query.toLowerCase()).then(function(res){
      return res;
    });
  }

  $scope.viewSelectedCampaign = function(campaign) {
    $location.path('/owner/' + $rootScope.clientSlug + '/campaign-details/' + campaign.id + "/" + campaign.type);
  }

  function selectedItemChange(item) {
    //console.log('Item changed to ' + JSON.stringify(item));
  }
  /*==============================
  | Campaign Search
  ==============================*/


  /*=========================
  | Page based initial loads
  =========================*/

  if($rootScope.currStateName == "owner.campaigns"){
    $scope.getUserCampaignsForOwner();
    loadOwnerCampaigns();
  }
  if($rootScope.currStateName == "owner.suggest-products"){
    loadOwnerProductList();
  }
  if(typeof $stateParams.campaignId !== 'undefined' && typeof $stateParams.campaignType !== 'undefined'){
    if($stateParams.campaignType == 2){
      $scope.getOwnerCampaignDetails($stateParams.campaignId);
    }
    else{
      $scope.getUserCampaignDetails($stateParams.campaignId);
    }
  }

  if($rootScope.currStateName == 'owner.payments'){
    getCampaignWithPayments();
  }
  if($rootScope.currStateName == 'owner.update-payments'){
    $scope.allCampaignsForOwner = [];
    loadOwnerCampaigns().then(function(result){
      $scope.getUserCampaignsForOwner().then(function(result2){        
        $scope.allCampaignsForOwner = _.filter(result.concat(result2), function(c){
          return c.status >= 6;
        });
      });
    })
  }
  
  /*=============================
  | Page based initial loads end
  =============================*/

});