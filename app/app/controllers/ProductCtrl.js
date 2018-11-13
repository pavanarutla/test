app.controller('UserProductCtrl', function ($scope, $rootScope, $mdSidenav, $mdDialog, $timeout, MapService, config, CampaignService){

  $scope.config = config;

  /*==============================
  | Pagination
  ==============================*/

  /*==============================
  | Pagination ends
  ==============================*/


  /*==============================
  | Sidenavs and mdDialogs
  ==============================*/
  $scope.productview = function () {
    $mdSidenav('productDetailsList').toggle();
  };

  $scope.showSaveCampaignPopup = false;
  $scope.toggleSaveCampaignPopup = function () {
    $scope.showSaveCampaignPopup = !$scope.showSaveCampaignPopup;
  }
  /*==============================
  | Sidenavs and mdDialogs ends
  ==============================*/
  if ($rootScope.formatSelected) {
    $scope.selectedFormatIndex = $rootScope.formatSelected;
  }
  else {
    $scope.selectedFormatIndex = 0;
  }

  /*=================================
  | Product section
  =================================*/
  function getShortListedProducts() {
    MapService.getshortListProduct(JSON.parse(localStorage.loggedInUser).id).then(function (response) {
      $scope.shortListedProducts = response;
    });
  }
  $scope.deleteShortlisted = function (ev, shortlistId) {
    MapService.deleteShortlistedProduct(shortlistId).then(function (response) {
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('body')))
          .clickOutsideToClose(true)
          .title('ShortList Product')
          .textContent(response.message)
          .ariaLabel('delete-shortlisted')
          .ok('Got it!')
          .targetEvent(ev)
      );
      getShortListedProducts();
    });
  };
  /*=================================
  | Product section ends
  =================================*/


  /*=================================
  | Campaign section
  =================================*/
  $scope.saveCampaign = function () {
    // If we finally decide to use selecting products for a campaign
    // if($scope.selectedForNewCampaign.length == 0){
    //   // add all shortlisted products to campaign
    //   console.log($scope.shortListedProducts);
    //   // CampaignService.saveCampaign($scope.shortListedProducts).then(function(response){
    //   //   $scope.campaignSavedSuccessfully = true;
    //   // });
    // }
    // else{
    //   // add all shortlisted products for new campaign
    //   console.log($scope.selectedForNewCampaign);
    //   // CampaignService.saveCampaign($scope.selectedForNewCampaign).then(function(response){
    //   //   $scope.campaignSavedSuccessfully = true;
    //   // });
    // }
    // campaign.products = $scope.selectedForNewCampaign;
    if ($scope.shortListedProducts.length > 0) {
      $scope.campaign.shortlisted_products = [];
      _.each($scope.shortListedProducts, function (v, i) {
        $scope.campaign.shortlisted_products.push(v.id);
      });
      CampaignService.saveUserCampaign($scope.campaign).then(function (response) {
        if(response.status == 1){
          $scope.campaignSavedSuccessfully = true;
          $timeout(function () {
            $mdSidenav('saveCampaignSidenav').close();
            $mdSidenav('shortlistAndSaveSidenav').close();
            $scope.campaign = {};
            $scope.forms.viewAndSaveCampaignForm.$setPristine();
            $scope.forms.viewAndSaveCampaignForm.$setUntouched();
            $scope.campaignSavedSuccessfully = false;
          }, 3000);
          $scope.loadActiveUserCampaigns();
          getShortListedProducts();
        }
        else{
          $scope.saveUserCampaignErrors = response.message;
        }
      });
    }
    else {
      toastr.error("Please shortlist some products first.");
    }
  }

  //view campaign details
  $scope.viewCampaignDetails = function (campaignId) {
    CampaignService.getCampaignWithProducts(campaignId).then(function (campaignDetails) {
      $scope.campaignDetails = campaignDetails;
      $scope.$parent.alreadyShortlisted = true;
      // $scope.toggleCampaignDetailSidenav();
    });
  }
  /*=================================
  | Campaign section ends
  =================================*/


  /*=======================================
  | Route based initial loads
  =======================================*/
  if ($rootScope.currStateName == "index.campaign-details") {
    $scope.viewCampaignDetails(localStorage.viewCampaignDetailsId)
  }

  if ($rootScope.currStateName == "index.shortlisted-products") {
    getShortListedProducts();
  }
  /*=======================================
  | Route based initial loads end
  =======================================*/

});
