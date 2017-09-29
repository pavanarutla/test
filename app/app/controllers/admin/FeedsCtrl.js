app.controller('AdminFeedsCtrl', function ($scope, $mdDialog, $http, $location, AdminCampaignService, ProductService, toastr) {
  
    $scope.msg = {};
    $scope.limit = 3;

    ProductService.getProductList().then(function(result){
      $scope.productList = result;
    });

    /*
    ======== Campaign requests =======
    */
    AdminCampaignService.getAllCampaignRequests().then(function(result){
      $scope.requestList = result;
      // $scope.groupedRequests = _.groupBy(requestList, function(request){
      //   return request.status;
      // });
    });
    /*
    ======== Campaign requests ends =======
    */

    $scope.showCampaignDetailsPopup = function (ev, campaignData) {
      $scope.selectedRequestDetails = campaignData;
      $mdDialog.show({
        templateUrl: 'views/admin/campaign-details-popup.html',
        fullscreen: $scope.customFullscreen,
        clickOutsideToClose: true,
        preserveScope: true,
        scope: $scope
      })
    };

    $scope.closeCampaignRequestDetails = function(){
      $mdDialog.hide();
    }
  
    /*
    ======== Campaign Suggestions(planned) ========
    */
    $scope.suggestProductsForCampaign = function(){
      AdminCampaignService.saveCampaignData($scope.selectedRequestDetails);
      $location.path('/admin/suggest-products');
    }
    // AdminCampaignService.getPlannedCampaigns().then(function(result){
    //   $scope.campaignProposalList = result;
    // });
    /*
    ======== Campaign Suggestions(planned) ends ========
    */

    $scope.loadMore = function () {
      $scope.limit = $scope.items.length
    }
  });
  