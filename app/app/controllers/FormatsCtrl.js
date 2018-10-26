app.controller('FormatsCtrl', function ($scope,$rootScope,$mdSidenav,$mdDialog,MapService,config,CampaignService) {

  if($rootScope.formatSelected){
    $scope.selectedFormatIndex = $rootScope.formatSelected;
  }
  else{
    $scope.selectedFormatIndex = 0;
  }
  $scope.productview = function () {
    $mdSidenav('productDetailsList').toggle();
  };


  $scope.savecampagin = false;
  $scope.saveCampagin = function () {
      $scope.savecampagin = !$scope.savecampagin;
  }

  function getShortListedProducts() {
    MapService.getshortListProduct(JSON.parse(localStorage.loggedInUser).id).then(function (response) {
      $scope.shortListedProducts = response;
    });
  }

  // Delete shortlisted-Product
  $scope.deleteShortlisted = function (ev, productId) {
    // console.log(productId);
    MapService.deleteShortlistedProduct(JSON.parse(localStorage.loggedInUser).id, productId).then(function (response) {
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
  // Ends Delete


  //view campaign details
  $scope.viewCampaignDetails = function (campaignId) {
        CampaignService.getCampaignWithProducts(campaignId).then(function (campaignDetails) {
          $scope.campaignDetails = campaignDetails;
          $scope.$parent.alreadyShortlisted = true;
          // $scope.toggleCampaignDetailSidenav();
        });
      }

  if($rootScope.currStateName == "index.request-campaign"){
    $scope.viewCampaignDetails(localStorage.viewCampaignDetailsId)
  }

  if($rootScope.currStateName == "index.shortlist-products"){
    getShortListedProducts();
  }
  // if($rootScope.currStateName == "index.user-saved-campaigns"){
  //   $scope.loadActiveUserCampaigns();
  // }
//   $scope.shortlistSelected = function (ev) {
//     console.log(working)
//     MapService.shortListProduct($scope.selectedProduct.properties.id, JSON.parse(localStorage.loggedInUser).id).then(function (response) {
//       $mdDialog.show(
//         $mdDialog.alert()
//           .parent(angular.element(document.querySelector('body')))
//           .clickOutsideToClose(true)
//           .title('Shortlist Product')
//           .textContent(response.message)
//           .ariaLabel('shortlist-success')
//           .ok('Got it!')
//           .targetEvent(ev),
//         $mdSidenav('productDetails').close()
//       );
//       getShortListedProducts();
//       $mdSidenav('productDetails').close();
//     });
//   }
});
