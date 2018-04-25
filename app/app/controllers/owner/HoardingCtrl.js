app.controller('OwnerHoardingCtrl', function ($scope, $mdDialog, $http,$mdSidenav,$location, AdminCampaignService, ProductService, toastr) {
  
    $scope.msg = {};
    $scope.limit = 3;
    $scope.pageNo = 1;

    $scope.productList = [];
    $scope.loadProductList = function(){
      ProductService.ProductsOfOwner($scope.pageNo).then(function(result){
        if(localStorage.ownerCampaignForSuggestion){
          var ownerCampaignForSuggestion = JSON.parse(localStorage.ownerCampaignForSuggestion);
          if(ownerCampaignForSuggestion.products && ownerCampaignForSuggestion.products.length > 0){
            _.map(result, function(p){
              if(_.find(JSON.parse(localStorage.ownerCampaignForSuggestion).products, {id: p.id}) !== undefined){
                p.alreadyAdded = true;
                return p;
              } 
            });  
          } 
        }
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

    // $scope.alreadyAdded = function(productId){
    //   console.log(count++);
    //   console.log($scope.productList.length);
    //   // return _.find(campaign.products, {id: productId}) !== undefined;
    // }

   
    $scope.loadMore = function () {
      $scope.limit = $scope.items.length
    }

    // shortlist popup

    $scope.shortlistProduct = function() {
        $mdSidenav('shortlistAndSaveOwnerSidenav').toggle();
    };
    // add product

    $scope.addProductOwner = function() {
        $mdSidenav('addProductOwnerSidenav').toggle();
    };
    $scope.shareProducts = function() {
        $mdSidenav('shareProductOwner').toggle();
    };
    // close popup
    
    $scope.closepopup = function(){
      $mdDialog.hide();
    }
  });
 