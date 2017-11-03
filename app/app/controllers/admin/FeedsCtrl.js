app.controller('AdminFeedsCtrl', function ($scope, $mdDialog, $http, $location, AdminCampaignService, ProductService, toastr) {
  
    $scope.msg = {};
    $scope.limit = 3;
    $scope.pageNo = 1;

    $scope.productList = [];
    $scope.loadProductList = function(){
      ProductService.getProductForPage($scope.pageNo).then(function(result){
        $scope.pageNo += 1;
        $scope.productList = $scope.productList.concat(result);
      });
    }
    $scope.loadProductList();

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

    // saves the campaign details in a service so it can be accessed on suggest-product page.
    // different from sugggestProductForCampaign (no 's', and a parameter 'suggestedProduct')
    // as it's used for redirecting the user to suggest-product page with campaign details saved,
    // while suggestProductForCampaign actually adds a product in the campaign

    $scope.suggestProductsForCampaign = function(){
      localStorage.campaignForSuggestion = JSON.stringify($scope.selectedRequestDetails);
      $location.path('/admin/suggest-products');
    }

    // adds a product in the campaign
    $scope.suggestProductForCampaign = function(suggestedProduct){
      if(!localStorage.campaignForSuggestion){
        toastr.error("No Campaign is seleted. Please select which campaign you're adding this product in to.")
      }
      else{
        var postObj = {
          campaign_id: JSON.parse(localStorage.campaignForSuggestion).id,
          product:{
            id: suggestedProduct.id,
            from_date: suggestedProduct.start_date,
            to_date:  suggestedProduct.end_date,
            price: suggestedProduct.price
          }
        };
        AdminCampaignService.proposeProductForCampaign(postObj).then(function(result){
          if(result.status == 1){
            toastr.success(result.message);
          }
          else{
            toastr.error(result.message);
          }
        });
      }
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
  