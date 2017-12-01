app.controller('AdminFeedsCtrl', function ($scope, $mdDialog, $http,$mdSidenav, $location, AdminCampaignService, ProductService, toastr) {
  
    $scope.msg = {};
    $scope.limit = 3;
    $scope.pageNo = 1;

    $scope.productList = [];
    $scope.loadProductList = function(){
      ProductService.getProductForPage($scope.pageNo).then(function(result){
        if(localStorage.campaignForSuggestion){
          var campaignForSuggestion = JSON.parse(localStorage.campaignForSuggestion);
          $scope.campaignStartDate = campaignForSuggestion.start_date;
          $scope.campaignEndDate = campaignForSuggestion.end_date;
          $scope.campaignEstBudget = campaignForSuggestion.est_budget;
          $scope.campaignActBudget = campaignForSuggestion.act_budget;
          if(campaignForSuggestion.products && campaignForSuggestion.products.length > 0){
            _.map(result, function(p){
              if(_.find(JSON.parse(localStorage.campaignForSuggestion).products, {id: p.id}) !== undefined){
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

    $scope.createCampaignToSuggest = function(emptyCampaign){
      $mdDialog.show({
        locals: {emptyCampaign: emptyCampaign, campaignPartial: $scope.selectedRequestDetails},
        templateUrl: 'views/admin/add-campaign.html',
        clickOutsideToClose: true,
        fullscreen: $scope.customFullscreen,
        controller: function($scope, $mdDialog, AdminCampaignService, emptyCampaign, campaignPartial, toastr){
          emptyCampaign = _.extend(emptyCampaign, campaignPartial);
          // console.log(emptyCampaign);
          $scope.campaign = emptyCampaign;
          $scope.saveCampaign = function(){
            AdminCampaignService.saveCampaign($scope.campaign).then(function(result){
              if(result.status == 1){
                toastr.success(result.message);
                $mdDialog.hide();
              }
              else{
                toastr.error(result.message);
              }
            });
          }
          $scope.close = function(){
            $mdDialog.hide();
          }
        }
      });
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
            AdminCampaignService.getCampaignWithProducts(JSON.parse(localStorage.campaignForSuggestion).id).then(function(updatedCampaignData){
              localStorage.campaignForSuggestion = JSON.stringify(updatedCampaignData);
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

    $scope.removeProductFromCampaignSuggestion = function(productId){
      var campaignId = JSON.parse(localStorage.campaignForSuggestion).id;
      AdminCampaignService.deleteProductFromCampaign(campaignId, productId).then(function(result){
        if(result.status == 1){
          AdminCampaignService.getCampaignWithProducts(JSON.parse(localStorage.campaignForSuggestion).id).then(function(updatedCampaignData){
            localStorage.campaignForSuggestion = JSON.stringify(updatedCampaignData);
            console.log(JSON.stringify(updatedCampaignData));
            $scope.campaignActBudget = updatedCampaignData.act_budget;
          });
          _.map($scope.productList, function(product){
            if(product.id == productId){
              product.alreadyAdded = false;             
            }
            return product;
          });          
        }
        else{
          toastr.error(result.message);
        }
      });
    }

    // AdminCampaignService.getPlannedCampaigns().then(function(result){
    //   $scope.campaignProposalList = result;
    // });
    /*
    ======== Campaign Suggestions(planned) ends ========
    */

    /*
    ======= Campaign Proposals =======
    */
    $scope.prepareQuoteForCampaign = function(campaignId){
      localStorage.campaignForSuggestion = JSON.stringify($scope.selectedRequestDetails);
      $location.path('/admin/campaign-proposal-summary/' + campaignId);
    }

    /*
    ======= Campaign Proposals Ends =======
    */

    $scope.loadMore = function () {
      $scope.limit = $scope.items.length
    }
    /*////popu////////*/
    $scope.closeInputPanel = function() {
      $mdSidenav('ClientRequest').toggle();
    };

  });
  