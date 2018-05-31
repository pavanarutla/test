app.controller('OwnerFeedsCtrl', function ($scope, $mdDialog, $http,$mdSidenav,$location, AdminCampaignService, ProductService, toastr, OwnerCampaignService) {
  
    $scope.msg = {};
    $scope.limit = 3;
    $scope.pageNo = 1;
    var currentUser = JSON.parse(localStorage.loggedInUser);

    $scope.productList = [];
    $scope.loadProductList = function(){
      ProductService.ListofProductOwner({pageNo:$scope.pageNo}).then(function(result){
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
        $scope.start_date_p = ownerCampaignForSuggestion.start_date;
        $scope.end_date_p = ownerCampaignForSuggestion.end_date;
        console.log(ownerCampaignForSuggestion);
        console.log($scope.start_date_p);
        $scope.pageNo += 1;
        $scope.productList = $scope.productList.concat(result);
      });
    }
    $scope.loadProductList();

    /*
    ======== Campaign requests =======
    */
    OwnerCampaignService.ownerCamapignsRequest().then(function(result){
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

    $scope.suggestProductsForCampaign = function(){
      localStorage.ownerCampaignForSuggestion = JSON.stringify($scope.selectedRequestDetails);
      $location.path('/owner/'+currentUser.username+'/suggestproducts');
    }

    // adds a product in the campaign
    $scope.suggestProductForCampaign = function(suggestedProduct){
      if(!localStorage.ownerCampaignForSuggestion){
        toastr.error("No Campaign is seleted. Please select which campaign you're adding this product in to.")
      }
      else{
        var postObj = {
          campaign_id: JSON.parse(localStorage.ownerCampaignForSuggestion).id,
          product:{
            id: suggestedProduct.id,
            from_date: suggestedProduct.start_date,
            to_date:  suggestedProduct.end_date,
            price: suggestedProduct.price
          }
        };
        AdminCampaignService.proposeProductForCampaign(postObj).then(function(result){
          if(result.status == 1){
            AdminCampaignService.getCampaignWithProducts(JSON.parse(localStorage.ownerCampaignForSuggestion).id).then(function(updatedCampaignData){
              localStorage.ownerCampaignForSuggestion = JSON.stringify(updatedCampaignData);
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

    $scope.removeProductFromCampaignSuggestion = function(productId){
      var campaignId = JSON.parse(localStorage.campaignForSuggestion).id;
      AdminCampaignService.deleteProductFromCampaign(campaignId, productId).then(function(result){
        if(result.status == 1){
          AdminCampaignService.getCampaignWithProducts(JSON.parse(localStorage.campaignForSuggestion).id).then(function(updatedCampaignData){
            localStorage.campaignForSuggestion = JSON.stringify(updatedCampaignData);
          });
          _.map($scope.productList, function(product){
            if(product.id == productId){
              product.alreadyAdded = false;             
            }
            return product;
          });          
        }
      });
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
 