app.controller('CampaignProposalCtrl', function ($scope, $mdDialog, $stateParams, $mdSidenav, $location, $rootScope, CampaignService, AdminCampaignService, ProductService, config, toastr) {

  $scope.productList = [];
  
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

  $scope.loadProductList = function(){
    if($scope.searchAll){
      var search = $scope.searchAll;
    }else {
      search = '';
    }
    ProductService.getSearchProductList($scope.pagination.pageNo, $scope.pagination.pageSize, search).then(function(result){
      if(localStorage.campaignForSuggestion){
        var campaignForSuggestion = JSON.parse(localStorage.campaignForSuggestion);
        $scope.campaignId = campaignForSuggestion.id;
        $scope.campaignStartDate = campaignForSuggestion.start_date;
        $scope.campaignEndDate = campaignForSuggestion.end_date;
        $scope.campaignEstBudget = campaignForSuggestion.est_budget;
        $scope.campaignActBudget = campaignForSuggestion.act_budget;
        if(campaignForSuggestion.products && campaignForSuggestion.products.length > 0){
          _.map(result.products, function(p){
            if(_.find(JSON.parse(localStorage.campaignForSuggestion).products, {id: p.id}) !== undefined){
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
    
  if($rootScope.currStateName == "admin.suggest-products"){
    if(!localStorage.campaignForSuggestion){
      toastr.error("No Campaign is seleted. Please select which campaign you're adding this product in to.")
    }
    else{
      $scope.loadProductList();
    }
  }

  /****** Search ************/
   $scope.searchAll = "";

  $scope.clearSearch = function () {
    $scope.searchAll = "";
    $scope.pageNo = 1;
    $scope.loadProductList();
  };
  $scope.searchHoardingData = function () {
    $scope.pageNo = 1;
    $scope.loadProductList();
  };

   $scope.loadCampaignData = function(campaignId){
    CampaignService.getCampaignWithProducts(campaignId).then(function(result){
      $scope.campaignDetails = result;
      $scope.campaignProducts = result.products;
      if(result.status > 7){
        loadCampaignPayments(campaignId);
      }
    });
  }

  function loadCampaignPayments(campaignId){
    if($scope.campaignDetails.status >= 6 ){
      AdminCampaignService.getCampaignPaymentDetails(campaignId).then(function(result){
        $scope.campaignPayments = result;
      });
    }
    else{
      toastr.error('Payments are only available for running or stopped campaigns.');
    }
  }

  if($stateParams.campaignId){
    var campaignId = $stateParams.campaignId;
    $scope.loadCampaignData(campaignId);
  }

  $scope.addNewProductToCampaign = function(){
    localStorage.campaignForSuggestion = JSON.stringify($scope.campaignDetails);
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
          // console.log(JSON.stringify(updatedCampaignData));
          $scope.campaignActBudget = updatedCampaignData.act_budget;
        });
        _.map($scope.productList, function(product){
          if(product.id == productId){
            product.alreadyAdded = false;             
          }
          return product;
        });
        toastr.success("Product removed from campaign");
      }
      else{
        toastr.error(result.message);
      }
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

  $scope.editProposedProduct = function(productId, from_date, to_date, price){
    var productObj = {
      id: productId,
      from_date: from_date,
      to_date: to_date,
      price: price
    };
    $mdDialog.show({
      locals:{ campaignId: $scope.campaignDetails.id, productObj : productObj, ctrlScope : $scope },
      templateUrl: 'views/admin/edit-proposed-product.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
      controller:function($scope, $mdDialog, CampaignService, AdminCampaignService, ctrlScope, campaignId, productObj){
        $scope.product = productObj;
        $scope.updateProposedProduct = function(product){
          AdminCampaignService.updateProposedProduct(campaignId, $scope.product).then(function(result){
            if(result.status == 1){
              // update succeeded. update the grid now.
              CampaignService.getCampaignWithProducts(campaignId).then(function(result){
                ctrlScope.campaignDetails = result;
                ctrlScope.campaignProducts = result.products;
                $mdDialog.hide();
              });
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

  $scope.finalizeCampaign = function(){
    if($scope.campaignDetails.act_budget > $scope.campaignDetails.exp_budget){
      var budget_check = confirm("Actual budget is larger than Expected budget. Are you sure you want to finalize this campaign?");
      if(budget_check){
        AdminCampaignService.finalizeCampaignByAdmin($scope.campaignDetails.id).then(function(result){
          if(result.status == 1){
            $scope.campaignDetails.status = 3;
            toastr.success("Campaign Finalized!"); // now we wait for launch request from user.
          }
          else{
            toastr.error(result.message);
          }
        });
      }
    }
    else{
      AdminCampaignService.finalizeCampaignByAdmin($scope.campaignDetails.id).then(function(result){
        if(result.status == 1){
          $scope.campaignDetails.status = 3;
          toastr.success("Campaign Finalized!"); // now we wait for launch request from user.
        }
        else{
          toastr.error(result.message);
        }
      });
    }
  }
  
  /*////popup////////*/
  $scope.toggleQuoteChangeRequestDetailsSidenav = function() {
    $mdSidenav('quoteChangeRequestDetailsSidenav').toggle();
  };

  $scope.launchCampaign = function(campaignId, ev){
    AdminCampaignService.launchCampaign(campaignId).then(function(result){
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
        $scope.loadCampaignData(campaignId);
      }
      else{
        toastr.error(result.message);
      }
    });
  }

  $scope.showUpdatePaymentForm = function(){
    $mdDialog.show({
      locals:{ campaignId: $scope.campaignDetails.id, ctrlScope : $scope },
      templateUrl: 'views/admin/update-campaign-payment.html',
      fullscreen: $scope.customFullscreen,
      clickOutsideToClose:true,
      controller:function($scope, $mdDialog, CampaignService, AdminCampaignService, ctrlScope, campaignId){
        $scope.paymentTypes = [
          {name: "Cash"},
          {name: "Cheque"},
          {name: "Online"},
          {name: "Transfer"}
        ];
        $scope.updateCampaignPayment = function(){
          $scope.campaignPayment.campaign_id = campaignId;
          AdminCampaignService.updateCampaignPayment($scope.campaignPayment).then(function(result){
            if(result.status == 1){
              // update succeeded. update the grid now.
              loadCampaignPayments(campaignId);
              toastr.success(result.message);
              $rootScope.closeMdDialog();
            }
            else{
              toastr.error(result.message);
            }
          });
        }
      }
    });
  }

  $scope.closeCampaign = function(campaignId, ev){
    AdminCampaignService.closeCampaign(campaignId).then(function(result){
      if(result.status == 1){
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
        $scope.loadCampaignData(campaignId);
      }
      else{
        toastr.error(result.message);
      }
    });
  }

  $scope.deleteProductFromCampaign = function(campaignId, productId){
    AdminCampaignService.deleteProductFromCampaign(campaignId, productId).then(function(result){
      if(result.status == 1){
        $scope.loadCampaignData(campaignId);
        toastr.success(result.message);
      }
      else{
        toastr.error(result.message);
      }
    });
  }

  $scope.getChangeRequestHistory = function(campaignId){
    AdminCampaignService.getChangeRequestHistory(campaignId).then(function(result){
      $scope.changeRequestHistory = result;
      $scope.toggleQuoteChangeRequestDetailsSidenav();
    })
  }

});
