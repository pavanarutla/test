app.controller('OwnerCampaignCtrl', function ($scope, $mdDialog,$mdSidenav, $interval, $stateParams, $window, $rootScope, OwnerCampaignService, toastr) {

  $scope.forms = [];

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

  ////data for image uploading 

  $scope.data = {};
  $scope.uploadFile = function (input) {
    $scope.data.fileName = input.files[0].name;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        //Sets the Old Image to new New Image
        $('#photo-id').attr('src', e.target.result);
        //Create a canvas and draw image on Client Side to get the byte[] equivalent
        var canvas = document.createElement("canvas");
        var imageElement = document.createElement("img");
        imageElement.setAttribute('src', e.target.result);
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
        var context = canvas.getContext("2d");
        context.drawImage(imageElement, 0, 0);
        var base64Image = canvas.toDataURL("image/jpeg");
        //Removes the Data Type Prefix 
        //And set the view model to the new value
        $scope.data.uploadedPhoto = e.target.result.replace(/data:image\/jpeg;base64,/g, '');
        // console.log($scope.data.uploadedPhoto);
      }
      //Renders Image on Page
      reader.readAsDataURL(input.files[0]);
    }
  };

  // get all Campaigns by a user to show it in campaign management page
  $scope.getUserCampaignsForOwner = function () {
    OwnerCampaignService.getUserCampaignsForOwner().then(function (result) {
      $scope.plannedCampaigns = _.filter(result, function(c){
        return c.status < 6;
      });
      $scope.runningCampaigns = _.where(result, { status: 3 });
      $scope.closedCampaigns = _.where(result, { status: 5 });
    });
  }
  var loadOwnerCampaigns = function(){
    OwnerCampaignService.getOwnerCampaigns().then(function(result){
      $scope.ownerCampaigns = result;
    });
  }
  if($rootScope.currStateName == "owner.campaigns"){
    $scope.getUserCampaignsForOwner();
    loadOwnerCampaigns();
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
      else{
        toastr.error(result.message);
      }
    });  
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
  if(typeof $stateParams.campaignId !== 'undefined' && typeof $stateParams.campaignType !== 'undefined'){
    if($stateParams.campaignType == 2){
      $scope.getOwnerCampaignDetails($stateParams.campaignId);
    }
    else{
      $scope.getCampaignDetails($stateParams.campaignId);
    }
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
      locals:{ campaignId: $scope.campaignDetails.id, productObj : productObj, ctrlScope : $scope },
      templateUrl: 'views/owner/edit-proposed-product.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
      controller:function($scope, $mdDialog, CampaignService, AdminCampaignService, ctrlScope, campaignId, productObj){
        $scope.product = productObj;
        $scope.updateProposedProduct = function(product){
          OwnerCampaignService.updateProposedProduct(campaignId, $scope.product).then(function(result){
            if(result.status == 1){
              // update succeeded. update the grid now.
              ctrlScope.getCampaignDetails(campaignId);
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

  /* ==============================
  | Campaign details section ends
  =============================== */

});